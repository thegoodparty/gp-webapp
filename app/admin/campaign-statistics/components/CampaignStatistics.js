import AdminCandidatesTable from 'app/admin/candidates/components/AdminCandidatesTable';
import Link from 'next/link';

export default function CampaignStatistics(props) {
  return (
    <div>
      <Link href="/admin/campaign-statistics">Clear Search</Link>
      <AdminCandidatesTable {...props} />
    </div>
  );
}
