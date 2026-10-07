import { MarketplaceFooter } from "./components/navigation/footer";
import { MarketPlaceHeader } from "./components/navigation/header";

export default function MarketPlaceLayout({ children }: LayoutProps<"/">) {
    return (
        <>

            <MarketPlaceHeader />
            <section className="mx-auto w-full max-w-312 space-y-7 px-4 pb-8 sm:px-6 min-h-full">
                {children}
            </section>

            <MarketplaceFooter />
        </>
    )
}