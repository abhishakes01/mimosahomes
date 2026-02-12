import EditServiceAreaClient from "./EditServiceAreaClient";

export const dynamic = 'force-dynamic';

export default async function EditServiceAreaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditServiceAreaClient id={id} />;
}
