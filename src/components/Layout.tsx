const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="lg:pl-20 bg-light-primary dark:bg-dark-primary min-h-screen lg:pb-20">
      <div className="max-w-screen-xl xl:mx-auto mx-4">{children}</div>
    </main>
  );
};

export default Layout;
