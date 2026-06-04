const HeroSlideContent = ({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  titleClassName = "",
  eyebrowClassName = "",
  containerClassName = "",
}) => (
  <div className="section-width relative z-10">
    <div
      className={`flex max-w-[90vw] flex-col items-center gap-2 text-center sm:max-w-3xl sm:gap-3 sm:items-start sm:text-left lg:gap-6 ${containerClassName}`}
    >
      {eyebrow && (
        <span
          className={`inline-block bg-[#182769] px-2 py-0.5 text-[9px] font-bold uppercase text-white sm:px-3 sm:py-2 sm:text-sm md:text-base xl:text-xl ${eyebrowClassName}`}
        >
          {eyebrow}
        </span>
      )}
      {title && (
        <h1
          className={`max-w-3xl text-[18px] font-extrabold leading-[1.1] text-white [text-wrap:balance] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[48px] ${titleClassName}`}
        >
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="max-w-[92vw] text-sm font-bold text-white sm:max-w-none sm:text-base md:text-lg xl:text-xl">
          {subtitle}
        </p>
      )}
      {children}
      {action}
    </div>
  </div>
);

export default HeroSlideContent;
