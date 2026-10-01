export default function AccountLayout({ children }: LayoutProps<"/">) {

    return (
        <>

            <main className="flex min-h-svh w-full">
                <section className="flex min-h-svh w-full items-center justify-center bg-violet-50 px-5 py-8 sm:px-8 sm:py-12 lg:w-1/2">
                    <div className="w-full max-w-md">{children}</div>
                </section>
                <section
                    className="relative hidden w-1/2 overflow-hidden bg-green-900 lg:block"
                    aria-hidden="true"
                >
                    <img
                        src="/images/background.jpg"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-emerald-700/30" />
                </section>
            </main>
        </>
    )
}