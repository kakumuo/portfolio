import { IconLoad } from "../components/Icons";
import { MainPage } from "../components/MainPage";


export function LoadingPage() {
    return <MainPage className="w-full h-full grid">
        <IconLoad className="animate-spin w-1/8 h-1/8 m-auto" />
    </MainPage>
}