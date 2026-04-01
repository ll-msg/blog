export const layoutContainer = 'mx-auto w-full max-w-[1120px] px-4 sm:px-6';

export const shellClass = 'relative z-[1] min-h-screen';
export const pageClass = 'w-full';
export const pageStackClass = 'w-full';

export const headerClass = 'sticky top-0 z-20 border-b border-[#dedede] bg-white/90 backdrop-blur-[14px]';
export const headerRowClass = 'flex items-center justify-between gap-4 max-md:items-start';
export const desktopNavClass = 'flex flex-1 items-center justify-end gap-5 max-md:hidden';

export const brandClass = '!text-[12px] !uppercase tracking-[0.16em] !text-[#595959]';
export const siteTitleClass = '!mb-0 !mt-1 tracking-[-0.03em] !text-[#111111]';

export const heroSectionClass = 'w-full max-w-[860px] pt-5';
export const heroTitleClass = '!mb-4 !mt-3 max-w-[920px] !text-[clamp(2.6rem,5vw,5rem)] !leading-[0.96] tracking-[-0.04em] !text-[#111111] max-md:!text-[2.9rem]';
export const compactHeroTitleClass = `${heroTitleClass} !text-[clamp(2rem,4vw,3.6rem)]`;
export const heroCopyClass = 'max-w-[720px] !text-[17px] !leading-[1.85] !text-[#595959]';
export const heroActionsClass = 'mt-7 flex flex-wrap gap-3';
export const metaBarClass = 'mt-7 flex flex-wrap gap-3';
export const metaChipClass = 'rounded-full border border-[#dedede] bg-white/80 px-3.5 py-2 text-[13px] uppercase tracking-[0.04em] text-[#595959]';
export const sectionTitleClass = '!mb-0 !text-[#111111]';

export const cardClass = 'h-full overflow-hidden border border-[#dedede] bg-white/90 shadow-none transition duration-200 hover:-translate-y-0.5 hover:border-[#cfcfcf] hover:bg-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.04)] [&_.ant-card-body]:p-7 max-md:[&_.ant-card-body]:p-5';
export const featureCardClass = `${cardClass} [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:gap-3.5`;
export const featureTitleClass = '!m-0 !text-[1.55rem] !leading-[1.15] tracking-[-0.03em] !text-[#111111]';
export const featureCopyClass = '!mb-0 !leading-[1.8] !text-[#595959]';
export const categoryTitleClass = '!mb-3 !mt-0 tracking-[-0.03em] !text-[#111111]';
export const categoryCopyClass = '!mb-0 !leading-[1.75] !text-[#595959]';

export const listClass = '[&_.ant-list-item]:border-b [&_.ant-list-item]:border-[#dedede] [&_.ant-list-item]:py-[18px]';
export const emptyClass = 'py-12';

export const articleLayoutClass = 'grid items-start gap-10 min-[1101px]:grid-cols-[minmax(0,1fr)_260px]';
export const articleAsideClass = 'max-[1100px]:hidden min-[1101px]:sticky min-[1101px]:top-24';
export const sidebarTitleClass = '!mb-3 !text-[12px] !uppercase tracking-[0.14em] !text-[#595959]';
export const articleBodyClass = 'mx-auto w-full max-w-[760px]';

export const editorGridClass = 'grid gap-6 md:grid-cols-2';

export const markdownClass = [
  'prose prose-neutral max-w-none font-sans text-[#111111]',
  'prose-headings:scroll-mt-24 prose-headings:text-[#111111]',
  '[&_h1]:text-[2.2rem] [&_h1]:font-extrabold [&_h1]:tracking-[-0.05em]',
  '[&_h2]:text-[1.7rem] [&_h2]:font-bold [&_h2]:tracking-[-0.04em]',
  '[&_h3]:text-[1.3rem] [&_h3]:font-semibold [&_h3]:tracking-[-0.03em]',
  '[&_h4]:text-[1.05rem] [&_h4]:font-semibold [&_h4]:tracking-[-0.02em]',
  '[&_p]:text-[14px] [&_p]:leading-[1.85] [&_p]:text-[#262626]',
  '[&_li]:text-[14px] [&_li]:leading-[1.85] [&_li]:text-[#262626]',
  'prose-blockquote:border-l-[3px] prose-blockquote:border-[#111111] prose-blockquote:py-2 prose-blockquote:pl-[18px] prose-blockquote:text-[#595959] prose-blockquote:font-normal',
  'prose-a:underline prose-a:decoration-1 prose-a:underline-offset-[3px] prose-a:text-inherit',
  'prose-code:before:content-none prose-code:after:content-none',
  'prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0',
].join(' ');

export const drawerClass = '[&_.ant-drawer-header]:border-b [&_.ant-drawer-header]:border-[#dedede] [&_.ant-drawer-body]:pt-3';
export const navLinkClass = '!text-[#595959] transition-colors hover:!text-[#111111]';
export const navLinkActiveClass = '!text-[#111111]';

export const buttonClass = '!h-10 !rounded-full !px-4';
export const inputClass = '[&_.ant-input]:rounded-full [&_.ant-input-affix-wrapper]:rounded-full';
export const mobileMenuButtonClass = 'md:!hidden';
