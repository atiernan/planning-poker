type RelativeTimeFormatUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

const units: Record<RelativeTimeFormatUnit, number> = {
    year  : 24 * 60 * 60 * 1000 * 365,
    month : 24 * 60 * 60 * 1000 * 365/12,
    day   : 24 * 60 * 60 * 1000,
    hour  : 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
}
  
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function useRelativeTime(): (when: Date) => string {
    return (when: string | Date) => {
        if (typeof when === 'string') {
            when = new Date(when);
        }
        const now = new Date();
        const elapsed = when.getTime() - now.getTime();
      
        for (const [unit, period] of Object.entries(units)) {
          if (Math.abs(elapsed) > period || unit == 'second') {
            return rtf.format(Math.round(elapsed / period), unit as RelativeTimeFormatUnit);
          }
        }
        return ''; 
    } 
}