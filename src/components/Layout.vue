<template>
  <div className="min-h-screen flex flex-col">
    <Header />
    <section className="flex-grow flex">
      <Sidebar />
      <main className="flex-grow p-4 bg-[#F7F9FD]">
        <RouterView />
      </main>
    </section>
  </div>
</template>
