'use client';

import H3 from '@shared/typography/H3';

import EditIssues from 'app/candidate/[slug]/components/issues/EditIssues';

export default function IssuesSection(props) {
  return (
    <section className="border-t pt-6 border-gray-600">
      <H3>Your Top Issues</H3>

      <EditIssues {...props} hideTitle noDrag />
    </section>
  );
}
