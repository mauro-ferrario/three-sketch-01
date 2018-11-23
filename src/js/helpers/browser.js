export const IsMobile = () => {
  return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export const IsSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') != -1 && !(ua.indexOf('chrome') > -1)) {
    return true;
  }
  return false;
};

export const IsSafariMobile = () => {
  return IsSafari() && IsMobile;
}

export const IsFirefox = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('firefox') != -1) {
    return true;
  }
  return false;
};
