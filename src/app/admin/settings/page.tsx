import { getUserSettings } from '@/lib/settings-actions';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const settings = await getUserSettings();
    return <SettingsForm initialSettings={settings} />;
}
