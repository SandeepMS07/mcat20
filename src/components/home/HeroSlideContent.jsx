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
      className={`flex max-w-3xl flex-col items-center gap-2 sm:gap-3 sm:items-start lg:gap-6 text-center sm:text-left ${containerClassName}`}
    >
      {eyebrow && (
        <span
          className={`inline-block bg-[#182769] px-2.5 py-1 sm:px-3 sm:py-2 text-[11px] sm:text-sm font-bold uppercase text-white md:text-base xl:text-xl ${eyebrowClassName}`}
        >
          {eyebrow}
        </span>
      )}
      {title && (
        <h1
          className={`font-extrabold text-white max-w-3xl text-[22px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[48px] leading-tight [text-wrap:balance] ${titleClassName}`}
        >
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="font-bold text-white text-sm sm:text-base md:text-lg xl:text-xl">
          {subtitle}
        </p>
      )}
      {children}
      {action}
    </div>
  </div>
);

export default HeroSlideContent;
