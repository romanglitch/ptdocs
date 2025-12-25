import {Tags} from "@/components/settings/tags";
import {Categories} from "@/components/settings/categories";
import {WeekNames} from "@/components/settings/week-names";


export default function SettingsPage() {
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <WeekNames />
            <Tags />
            <Categories />
        </div>
    );
}
