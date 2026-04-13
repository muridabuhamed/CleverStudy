import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Highlighter, Search, Trash2 
} from 'lucide-react';
import { Highlight } from '../types';
import { api } from '../services/api';

interface AnnotationSidebarProps {
  fileId: string;
  currentPage: number;
  onNavigateToPage: (page: number) => void;
}

type TabType = 'highlights' | 'search';

export const AnnotationSidebar: React.FC<AnnotationSidebarProps> = ({ 
  fileId, 
  currentPage, 
  onNavigateToPage 
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>('highlights');
  const [highlights, setHighlights] = React.useState<Highlight[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Load highlights
  const loadAnnotations = React.useCallback(async () => {
    try {
      const data = await annotationsApi.getAllAnnotations(fileId);
      setHighlights(data.highlights);
    } catch (error) {
      console.error('Failed to load highlights:', error);
    }
  }, [fileId]);

  React.useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

  // Notify parent about annotations status
  React.useEffect(() => {
    const hasData = highlights.length > 0;
    window.dispatchEvent(new CustomEvent('annotationsStatus', { 
      detail: { hasAnnotations: hasData } 
    }));
  }, [highlights]);

  // Listen for annotation additions
  React.useEffect(() => {
    const handleAnnotationAdded = () => {
      loadAnnotations();
    };
    
    window.addEventListener('annotationAdded', handleAnnotationAdded);
    return () => window.removeEventListener('annotationAdded', handleAnnotationAdded);
  }, [loadAnnotations]);

  // Search annotations
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await annotationsApi.searchAnnotations(query, fileId);
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Delete highlight
  const handleDeleteHighlight = async (id: string) => {
    try {
      await annotationsApi.deleteHighlight(id);
      setHighlights(highlights.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete highlight:', error);
    }
  };

  // Group items by page
  const groupByPage = (items: any[]) => {
    const grouped: { [key: number]: any[] } = {};
    items.forEach(item => {
      if (!grouped[item.page_number]) {
        grouped[item.page_number] = [];
      }
      grouped[item.page_number].push(item);
    });
    return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));
  };

  const tabs = [
    { id: 'highlights' as TabType, label: 'Highlights', icon: Highlighter, count: highlights.length },
    { id: 'search' as TabType, label: 'Search', icon: Search, count: null },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Annotations</h3>
        
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-2 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <tab.icon className="w-4 h-4" />
                {tab.count !== null && (
                  <span className="text-[10px]">{tab.count}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Highlights Tab */}
          {activeTab === 'highlights' && (
            <motion.div
              key="highlights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              {highlights.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Highlighter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No highlights yet</p>
                  <p className="text-xs mt-1">Select text to highlight</p>
                </div>
              ) : (
                groupByPage(highlights).map(([page, items]) => (
                  <div key={page} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                      <span>Page {page}</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    {items.map((highlight: Highlight) => (
                      <div
                        key={highlight.id}
                        className="group p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
                        onClick={() => onNavigateToPage(highlight.page_number)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-4 h-4 rounded-md mt-0.5 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: highlight.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
                              "{highlight.text_content}"
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Page {highlight.page_number}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteHighlight(highlight.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-md transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search annotations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {isSearching ? (
                <div className="text-center py-8 text-slate-400">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-8 text-slate-400">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No results found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => onNavigateToPage(result.page_number)}
                    >
                      <div className="flex items-start gap-2 mb-1">
                        {result.type === 'highlight' ? (
                          <Highlighter className="w-4 h-4 text-yellow-600 mt-0.5" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 mb-1">
                            {result.file_name} • Page {result.page_number}
                          </p>
                          <p className="text-sm text-slate-700 line-clamp-2">
                            {result.text_content || result.note_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
