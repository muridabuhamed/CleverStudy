import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Highlighter, MessageSquare, Bookmark, Search, X, 
  Trash2, Edit2, Check, ChevronRight, StickyNote 
} from 'lucide-react';
import { Highlight, Annotation, Bookmark as BookmarkType } from '../types';
import { api } from '../services/api';

interface AnnotationSidebarProps {
  fileId: string;
  currentPage: number;
  onNavigateToPage: (page: number) => void;
}

type TabType = 'highlights' | 'notes' | 'bookmarks' | 'search';

export const AnnotationSidebar: React.FC<AnnotationSidebarProps> = ({ 
  fileId, 
  currentPage, 
  onNavigateToPage 
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>('highlights');
  const [highlights, setHighlights] = React.useState<Highlight[]>([]);
  const [annotations, setAnnotations] = React.useState<Annotation[]>([]);
  const [bookmarks, setBookmarks] = React.useState<BookmarkType[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState('');

  // Load all annotations
  const loadAnnotations = React.useCallback(async () => {
    try {
      const data = await api.getAllAnnotations(fileId);
      setHighlights(data.highlights);
      setAnnotations(data.annotations);
      setBookmarks(data.bookmarks);
    } catch (error) {
      console.error('Failed to load annotations:', error);
    }
  }, [fileId]);

  React.useEffect(() => {
    loadAnnotations();
  }, [loadAnnotations]);

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
      const data = await api.searchAnnotations(query, fileId);
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Delete handlers
  const handleDeleteHighlight = async (id: string) => {
    try {
      await api.deleteHighlight(id);
      setHighlights(highlights.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete highlight:', error);
    }
  };

  const handleDeleteAnnotation = async (id: string) => {
    try {
      await api.deleteAnnotation(id);
      setAnnotations(annotations.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete annotation:', error);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await api.deleteBookmark(id);
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  // Update annotation
  const handleUpdateAnnotation = async (id: string) => {
    if (!editText.trim()) return;
    
    try {
      await api.updateAnnotation(id, editText);
      setAnnotations(annotations.map(a => 
        a.id === id ? { ...a, note_text: editText } : a
      ));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update annotation:', error);
    }
  };

  const startEdit = (annotation: Annotation) => {
    setEditingId(annotation.id);
    setEditText(annotation.note_text);
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
    { id: 'notes' as TabType, label: 'Notes', icon: StickyNote, count: annotations.length },
    { id: 'bookmarks' as TabType, label: 'Bookmarks', icon: Bookmark, count: bookmarks.length },
    { id: 'search' as TabType, label: 'Search', icon: Search, count: null },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Annotations</h3>
        
        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-lg">
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

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-4"
            >
              {annotations.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs mt-1">Add notes to remember key points</p>
                </div>
              ) : (
                groupByPage(annotations).map(([page, items]) => (
                  <div key={page} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
                      <span>Page {page}</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    {items.map((annotation: Annotation) => (
                      <div
                        key={annotation.id}
                        className="group p-3 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        {editingId === annotation.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 text-sm border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                              rows={3}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateAnnotation(annotation.id)}
                                className="flex-1 px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 flex items-center justify-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditText('');
                                }}
                                className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <p
                                className="flex-1 text-sm text-slate-700 cursor-pointer"
                                onClick={() => onNavigateToPage(annotation.page_number)}
                              >
                                {annotation.note_text}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(annotation)}
                                className="px-2 py-1 text-xs bg-amber-200 text-amber-800 rounded hover:bg-amber-300 flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAnnotation(annotation.id)}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-2"
            >
              {bookmarks.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No bookmarks yet</p>
                  <p className="text-xs mt-1">Bookmark important pages</p>
                </div>
              ) : (
                bookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="group p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                    onClick={() => onNavigateToPage(bookmark.page_number)}
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark className="w-4 h-4 text-indigo-600 flex-shrink-0 fill-current" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {bookmark.title}
                        </p>
                        <p className="text-xs text-slate-500">Page {bookmark.page_number}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBookmark(bookmark.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
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
