function addStyles (win, styles) {
  styles.forEach(style => {
    let link = win.document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', style);
    win.document.getElementsByTagName('head')[0].appendChild(link);
  });
}

const VueHtmlToPaper = {
  install (Vue, options = {}) {
    Vue.prototype.$htmlToPaper = (el, localOptions, cb = () => true) => {
      let defaultName = '_blank', 
        defaultSpecs = ['fullscreen=yes','titlebar=yes', 'scrollbars=yes'],
        defaultReplace = true,
        defaultStyles = [],
        defaultWindowTitle = window.document.title;
      let {
        name = defaultName,
        specs = defaultSpecs,
        replace = defaultReplace,
        styles = defaultStyles,
        autoClose = true,
        windowTitle = defaultWindowTitle,
      } = options;

      // If has localOptions
      // TODO: improve logic
      if (!!localOptions) {
        if (localOptions.name) name = localOptions.name;
        if (localOptions.specs) specs = localOptions.specs;
        if (localOptions.replace) replace = localOptions.replace;
        if (localOptions.styles) styles = [...styles, ...localOptions.styles]
        if (localOptions.autoClose === false) autoClose = localOptions.autoClose;
        if (localOptions.windowTitle) windowTitle = localOptions.windowTitle;
      }

      specs = !!specs.length ? specs.join(',') : '';

      const element = window.document.getElementById(el);

      if (!element) {
        alert(`Element to print #${el} not found!`);
        return;
      }
      
      const url = '';
      const win = window.open(url, name, specs, replace);

      win.document.write(`
        <html>
          <head>
            <title>${windowTitle || window.document.title}</title>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);

      addStyles(win, styles);
      
      setTimeout(() => {
        win.onafterprint = () => {
          if (autoClose) win.close();
          cb();
        }
        win.focus();
        win.print();
      }, 1000);
      
      return true;
    };
  },
};
  
export default VueHtmlToPaper;
