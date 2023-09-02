<template>
  <div className="min-h-screen flex flex-col">
    <Header />
    <section className="flex-grow flex">
      <Sidebar />
      <main className="flex-grow px-4 pb-4 pt-6 bg-[#F7F9FD]">
        <RouterView />
      </main>
    </section>
  </div>
</template>
