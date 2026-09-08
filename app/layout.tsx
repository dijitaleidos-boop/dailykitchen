import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Daily Kitchen | Sana özel, her gün taze',description:'Bursa’da diyetisyen eşliğinde kişiye özel beslenme ve günlük yemek aboneliği.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>}
