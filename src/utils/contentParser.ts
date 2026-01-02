export type ParsedPage = {
  pageNumber: number;
  content: string;
  moduleName?: string;
  lessonName?: string;
};

// Clean content by removing the ALS header
const removeALSHeader = (text: string): string => {
  const patterns = [
    /Alternative Learning System K to 12 Basic Education Curriculum \(ALS K to 12 BEC\)\s*/gi,
    /Alternative Learning System K to 12 Basic Education Curriculum\s*/gi,
    /ALS K to 12 BEC\s*/gi,
    /ALS K to 12\s*/gi,
  ];
  
  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned.trim();
};

// Remove module and lesson number prefixes for quiz content
export const cleanContentForQuiz = (text: string): string => {
  let cleaned = removeALSHeader(text);
  
  // Remove MODULE X: patterns and their titles
  cleaned = cleaned.replace(/MODULE\s*\d+\s*:[^\n]*/gi, '');
  
  // Remove Lesson X: patterns and their titles
  cleaned = cleaned.replace(/Lesson\s*\d+\s*:[^\n]*/gi, '');
  
  // Clean up extra whitespace and newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/^\s+/gm, '');
  
  return cleaned.trim();
};

// Format content with proper line breaks (no bold)
const formatContent = (text: string): string => {
  // First remove ALS header
  let formatted = removeALSHeader(text);
  
  // Normalize all line breaks first
  formatted = formatted.replace(/\r\n/g, '\n');
  formatted = formatted.replace(/\r/g, '\n');
  
  // Add line break after MODULE header (capture until end of line)
  formatted = formatted.replace(
    /(MODULE\s*\d+\s*:[^\n]*)\n?/gi, 
    '$1<br><br>'
  );
  
  // Add line breaks before and after Lesson headers (capture "Lesson X: Title" until period or newline)
  formatted = formatted.replace(
    /\n?(Lesson\s*\d+\s*:[^.\n]*\.?)\s*/gi, 
    '<br><br>$1<br>'
  );
  
  // Convert remaining double line breaks
  formatted = formatted.replace(/\n\n+/g, '<br><br>');
  
  // Convert remaining single line breaks to space
  formatted = formatted.replace(/\n/g, ' ');
  
  // Clean up multiple <br> tags (max 2)
  formatted = formatted.replace(/(<br>\s*){3,}/g, '<br><br>');
  
  // Remove leading <br> tags
  formatted = formatted.replace(/^(\s*<br>\s*)+/, '');
  
  // Remove trailing <br> tags
  formatted = formatted.replace(/(\s*<br>\s*)+$/, '');
  
  // Clean up extra spaces
  formatted = formatted.replace(/\s+/g, ' ');
  formatted = formatted.replace(/<br>\s+/g, '<br>');
  formatted = formatted.replace(/\s+<br>/g, '<br>');
  
  return formatted.trim();
};

// Detect module boundaries in content
const splitByModules = (content: string): { moduleName: string; content: string }[] => {
  const cleanedContent = removeALSHeader(content);
  const modulePattern = /(?=MODULE\s*\d+\s*:)/gi;
  const parts = cleanedContent.split(modulePattern).filter(part => part.trim().length > 0);
  
  if (parts.length === 0) {
    return [{ moduleName: '', content: cleanedContent }];
  }
  
  return parts.map(part => {
    const moduleMatch = part.match(/^(MODULE\s*\d+\s*:[^\n]*)/i);
    const moduleName = moduleMatch ? moduleMatch[1].trim() : '';
    return { moduleName, content: part.trim() };
  });
};

// Parse content preserving any existing formatting markers
export const parseAndPaginateContent = (
  rawContent: string,
  maxCharsPerPage: number = 2000
): ParsedPage[] => {
  if (!rawContent || rawContent.trim().length === 0) {
    return [{ pageNumber: 1, content: "No content available." }];
  }

  const modules = splitByModules(rawContent);
  const pages: ParsedPage[] = [];
  let pageNumber = 1;

  for (const module of modules) {
    const moduleContent = module.content;
    
    if (moduleContent.length <= maxCharsPerPage) {
      pages.push({
        pageNumber: pageNumber++,
        content: formatContent(moduleContent),
        moduleName: module.moduleName
      });
    } else {
      const lessonPattern = /(?=Lesson\s*\d+\s*:)/gi;
      const lessons = moduleContent.split(lessonPattern).filter(l => l.trim().length > 0);
      
      if (lessons.length > 1) {
        let currentPageContent = '';
        let currentLessonName = '';
        
        for (const lesson of lessons) {
          const lessonMatch = lesson.match(/^(Lesson\s*\d+\s*:[^\n]*)/i);
          const lessonName = lessonMatch ? lessonMatch[1].trim() : '';
          
          if (currentPageContent.length + lesson.length <= maxCharsPerPage) {
            currentPageContent += lesson;
            if (lessonName) currentLessonName = lessonName;
          } else {
            if (currentPageContent.trim()) {
              pages.push({
                pageNumber: pageNumber++,
                content: formatContent(currentPageContent),
                moduleName: module.moduleName,
                lessonName: currentLessonName
              });
            }
            currentPageContent = lesson;
            currentLessonName = lessonName;
          }
        }
        
        if (currentPageContent.trim()) {
          pages.push({
            pageNumber: pageNumber++,
            content: formatContent(currentPageContent),
            moduleName: module.moduleName,
            lessonName: currentLessonName
          });
        }
      } else {
        const paragraphs = moduleContent.split(/\n\n+/);
        let currentPageContent = '';
        
        for (const para of paragraphs) {
          if (currentPageContent.length + para.length + 2 <= maxCharsPerPage) {
            currentPageContent += (currentPageContent ? '\n\n' : '') + para;
          } else {
            if (currentPageContent.trim()) {
              pages.push({
                pageNumber: pageNumber++,
                content: formatContent(currentPageContent),
                moduleName: module.moduleName
              });
            }
            currentPageContent = para;
          }
        }
        
        if (currentPageContent.trim()) {
          pages.push({
            pageNumber: pageNumber++,
            content: formatContent(currentPageContent),
            moduleName: module.moduleName
          });
        }
      }
    }
  }

  if (pages.length === 0) {
    return [{ pageNumber: 1, content: formatContent(removeALSHeader(rawContent)) }];
  }

  return pages;
};

// Get plain text content for quiz generation (removes HTML and headers)
export const getPlainTextForQuiz = (htmlContent: string): string => {
  // Remove HTML tags
  let plain = htmlContent.replace(/<[^>]*>/g, ' ');
  
  // Clean up extra whitespace
  plain = plain.replace(/\s+/g, ' ').trim();
  
  // Clean for quiz (remove ALS header, module/lesson prefixes)
  plain = cleanContentForQuiz(plain);
  
  return plain;
};