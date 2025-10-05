export const scrollToSection = (sectionId: string, options: ScrollIntoViewOptions = { behavior: 'smooth' }) => {
  const element = document.getElementById(sectionId);
  if (!element) {
    return;
  }
  element.scrollIntoView(options);
};
