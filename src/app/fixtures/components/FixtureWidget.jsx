'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const WIDGET_SCRIPT_ID = 'mumbai-widget-script';
const WIDGET_CSS_HREF = 'https://new-matchcentre.s3.amazonaws.com/t20mumbai/static/css/main.76659b69.css';
const WIDGET_JS_SRC = 'https://new-matchcentre.s3.amazonaws.com/t20mumbai/static/js/main.59cd0d15.js';

const loadWidgetScript = () => {
  if (!document.querySelector(`link[href="${WIDGET_CSS_HREF}"]`)) {
    const link = document.createElement('link');
    link.href = WIDGET_CSS_HREF;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
  }

  const existingScript = document.getElementById(WIDGET_SCRIPT_ID);
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.src = WIDGET_JS_SRC;
  script.async = true;
  script.id = WIDGET_SCRIPT_ID;
  document.body.appendChild(script);
};

const FixtureWidget = () => {
  const pathname = usePathname();

  useEffect(() => {
    const container = document.getElementById('smmumbaiwidget-container');
    if (container) container.innerHTML = '';
    loadWidgetScript();
  }, [pathname]);

  return <div id="smmumbaiwidget-container" className="smmumbaiwidget" />;
};

export default FixtureWidget;