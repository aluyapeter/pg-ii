import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function PublicLayout({ children }) {
  return (
    <div className="public-layout-wrapper">
      {/* This renders once and persists across all public routes */}
      <PublicHeader />
      
      <main className="public-main-content">
        {children}
      </main>

      <PublicFooter />
      {/* We will build the Footer next and drop it here */}
    </div>
  );
}

// We will import the Header and Footer here once we build them
// import PublicHeader from '@/components/public/PublicHeader';
// import PublicFooter from '@/components/public/PublicFooter';

// export default function PublicLayout({ children }) {
//   return (
//     <div className="public-layout-wrapper">
//       {/* <PublicHeader /> */}
      
//       {/* The 'children' prop represents the specific page being rendered (e.g., the Home page) */}
//       <main className="public-main-content">
//         {children}
//       </main>

//       {/* <PublicFooter /> */}
//     </div>
//   );
// }