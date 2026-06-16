export const layoutContainer = 'mx-auto w-full max-w-[1120px] px-4 sm:px-6';

export const shellClass = 'relative z-[1] min-h-screen';
export const pageClass = 'w-full';
export const pageStackClass = 'w-full';

export const headerClass = 'sticky top-0 z-20 border-b border-[#4df0ff]/30 bg-[#05080d]/90 backdrop-blur-[8px]';
export const headerRowClass = 'flex items-center justify-between gap-4 max-md:items-start';
export const desktopNavClass = 'flex flex-1 items-center justify-end gap-5 max-md:hidden';

export const brandClass = '!text-[11px] !uppercase tracking-[0.3em] !text-[#4df0ff] font-mono';
export const siteTitleClass = '!mb-0 !mt-1 !font-[Orbitron] !font-bold tracking-[0.18em] !text-[#eaffff] [text-shadow:0_0_12px_rgba(77,240,255,0.55)]';

export const heroSectionClass = 'w-full max-w-[860px] pt-5';
export const heroTitleClass = '!mb-4 !mt-3 max-w-[920px] !font-[Orbitron] !font-black !text-[clamp(2rem,4.5vw,3.6rem)] !leading-[1.05] tracking-[0.02em] !text-[#eaffff] [text-shadow:0_0_18px_rgba(77,240,255,0.5)] max-md:!text-[2.2rem]';
export const compactHeroTitleClass = `${heroTitleClass} !text-[clamp(1.6rem,3.5vw,2.8rem)]`;
export const heroCopyClass = 'max-w-[720px] !text-[15px] !leading-[1.7] !text-[#9fd8e6] font-mono';
export const heroActionsClass = 'mt-7 flex flex-wrap gap-3';
export const metaBarClass = 'mt-7 flex flex-wrap gap-3';
export const metaChipClass = 'border border-[#4df0ff]/30 bg-[#4df0ff]/5 px-3.5 py-2 text-[12px] uppercase tracking-[0.1em] text-[#7fffe6] font-mono';
export const sectionTitleClass = '!mb-0 !font-[Orbitron] !font-bold tracking-[0.04em] !text-[#eaffff] [text-shadow:0_0_12px_rgba(77,240,255,0.45)]';

export const cardClass = 'h-full overflow-hidden border border-[#4df0ff]/25 bg-[#4df0ff]/5 transition duration-200 hover:-translate-y-0.5 hover:border-[#4df0ff]/60 hover:bg-[#4df0ff]/10 hover:shadow-[0_0_18px_rgba(77,240,255,0.15)] [&_.ant-card-body]:p-6 max-md:[&_.ant-card-body]:p-5';
export const featureCardClass = `${cardClass} [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:gap-3.5`;
export const featureTitleClass = '!m-0 !font-[Orbitron] !font-bold !text-[1.4rem] !leading-[1.2] tracking-[0.02em] !text-[#eaffff]';
export const featureCopyClass = '!mb-0 !leading-[1.7] !text-[#9fd8e6]';
export const categoryTitleClass = '!mb-3 !mt-0 !font-[Orbitron] !font-bold tracking-[0.04em] !text-[#eaffff]';
export const categoryCopyClass = '!mb-0 !leading-[1.7] !text-[#9fd8e6]';

export const listClass = '[&_.ant-list-item]:border-b [&_.ant-list-item]:border-[#4df0ff]/15 [&_.ant-list-item]:py-[18px]';
export const emptyClass = 'py-12';

export const articleLayoutClass = 'grid items-start gap-10 min-[1101px]:grid-cols-[minmax(0,1fr)_260px]';
export const articleAsideClass = 'max-[1100px]:hidden min-[1101px]:sticky min-[1101px]:top-24';
export const sidebarTitleClass = '!mb-3 !text-[12px] !uppercase tracking-[0.2em] !text-[#4df0ff] font-mono';
export const articleBodyClass = 'mx-auto w-full max-w-[760px]';

export const editorGridClass = 'grid gap-6 md:grid-cols-2';

export const markdownClass = [
  'prose prose-invert max-w-none font-sans text-[#cdd9e0]',
  'prose-headings:scroll-mt-24 prose-headings:font-[Orbitron] prose-headings:text-[#eaffff] prose-headings:tracking-[0.01em]',
  '[&_h1]:text-[2rem] [&_h1]:font-black',
  '[&_h2]:text-[1.55rem] [&_h2]:font-bold',
  '[&_h3]:text-[1.25rem] [&_h3]:font-bold',
  '[&_h4]:text-[1.05rem] [&_h4]:font-semibold',
  '[&_p]:text-[14px] [&_p]:leading-[1.85] [&_p]:text-[#cdd9e0]',
  '[&_li]:text-[14px] [&_li]:leading-[1.85] [&_li]:text-[#cdd9e0]',
  '[&_strong]:text-[#eaffff]',
  'prose-blockquote:border-l-[3px] prose-blockquote:border-[#4df0ff] prose-blockquote:py-2 prose-blockquote:pl-[18px] prose-blockquote:text-[#9fd8e6] prose-blockquote:font-normal',
  'prose-a:text-[#4df0ff] prose-a:underline prose-a:decoration-1 prose-a:underline-offset-[3px] hover:prose-a:text-[#9bf6ff]',
  'prose-code:before:content-none prose-code:after:content-none',
  'prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0',
  '[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-2',
].join(' ');

export const drawerClass = '[&_.ant-drawer-header]:border-b [&_.ant-drawer-header]:border-[#4df0ff]/20 [&_.ant-drawer-body]:pt-3';
export const navLinkClass = '!text-[#7fffe6] font-mono uppercase tracking-[0.08em] transition-colors hover:!text-[#4df0ff]';
export const navLinkActiveClass = '!text-[#4df0ff] [text-shadow:0_0_8px_rgba(77,240,255,0.5)]';

export const buttonClass = '!h-10 !rounded-none !px-4 font-mono !uppercase !tracking-[0.08em]';
export const inputClass = '[&_.ant-input]:rounded-none [&_.ant-input-affix-wrapper]:rounded-none';
export const mobileMenuButtonClass = 'md:!hidden';
