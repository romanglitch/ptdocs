import {Link} from "@heroui/link";

export default function NotFound() {
    return (
        <div className={'ptdocs-page flex flex-col gap-3 items-center justify-center text-center h-full'}>
            <h2 className={'text-lg'}>Страница не найдена</h2>
            <p className={'text-sm'}>Страница которую вы ищите не существует.</p>
            <Link className={'text-sm underline'} color={'foreground'} href="/">На главную</Link>
        </div>
    );
}
