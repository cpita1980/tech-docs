'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  IconButton,
  Divider,
  Toolbar,
} from '@mui/material';
import {
  MenuBook as BookIcon,
  ExpandLess,
  ExpandMore,
  Description as PageIcon,
  Folder as ChapterIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

interface PageItem {
  id: string;
  slug: string;
  title: string;
}

interface ChapterItem {
  id: string;
  slug: string;
  name: string;
  pages: PageItem[];
}

interface BookItem {
  id: string;
  slug: string;
  name: string;
  chapters: ChapterItem[];
  pages: PageItem[];
}

interface SidebarProps {
  books: BookItem[];
  currentBookSlug?: string;
  currentChapterSlug?: string;
  currentPageSlug?: string;
}

export default function Sidebar({
  books,
  currentBookSlug,
  currentChapterSlug,
  currentPageSlug,
}: SidebarProps) {
  const [expandedBooks, setExpandedBooks] = useState<string[]>([currentBookSlug || '']);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([currentChapterSlug || '']);

  const handleBookToggle = (bookId: string) => {
    setExpandedBooks((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleChapterToggle = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />

      <Box sx={{ overflow: 'auto', p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
          <Typography variant="h6" component="div">
            Biblioteca
          </Typography>
          <IconButton size="small" component={Link} href="/search">
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List dense>
          {books.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No hay libros disponibles
              </Typography>
              <IconButton component={Link} href="/admin/books/new" sx={{ mt: 1 }}>
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            books.map((book) => {
              const isBookExpanded = expandedBooks.includes(book.id);
              const isCurrentBook = book.slug === currentBookSlug;

              return (
                <React.Fragment key={book.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={isCurrentBook && !currentChapterSlug && !currentPageSlug}
                      onClick={() => handleBookToggle(book.id)}
                    >
                      <ListItemIcon>
                        <BookIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={book.name}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isCurrentBook ? 600 : 400,
                        }}
                      />
                      {isBookExpanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={isBookExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding dense>
                      {/* Páginas directas del libro */}
                      {book.pages.map((page) => (
                        <ListItemButton
                          key={page.id}
                          sx={{ pl: 4 }}
                          selected={page.slug === currentPageSlug && isCurrentBook}
                          component={Link}
                          href={`/books/${book.slug}/pages/${page.slug}`}
                        >
                          <ListItemIcon>
                            <PageIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={page.title}
                            primaryTypographyProps={{ fontSize: '0.85rem' }}
                          />
                        </ListItemButton>
                      ))}

                      {/* Capítulos con sus páginas */}
                      {book.chapters.map((chapter) => {
                        const isChapterExpanded = expandedChapters.includes(chapter.id);
                        const isCurrentChapter = chapter.slug === currentChapterSlug;

                        return (
                          <React.Fragment key={chapter.id}>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              selected={isCurrentChapter && !currentPageSlug}
                              onClick={() => handleChapterToggle(chapter.id)}
                            >
                              <ListItemIcon>
                                <ChapterIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={chapter.name}
                                primaryTypographyProps={{ fontSize: '0.85rem' }}
                              />
                              {isChapterExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                            </ListItemButton>

                            <Collapse in={isChapterExpanded} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding dense>
                                {chapter.pages.map((page) => (
                                  <ListItemButton
                                    key={page.id}
                                    sx={{ pl: 8 }}
                                    selected={page.slug === currentPageSlug && isCurrentChapter}
                                    component={Link}
                                    href={`/books/${book.slug}/chapters/${chapter.slug}/pages/${page.slug}`}
                                  >
                                    <ListItemIcon>
                                      <PageIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={page.title}
                                      primaryTypographyProps={{ fontSize: '0.8rem' }}
                                    />
                                  </ListItemButton>
                                ))}
                              </List>
                            </Collapse>
                          </React.Fragment>
                        );
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
