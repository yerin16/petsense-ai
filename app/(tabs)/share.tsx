import { Card, PageHeader, Screen, T } from '@/src/ui/components';

// Placeholder until milestone 4 (sitter view, vet-visit prep report).
export default function Share() {
  return (
    <Screen>
      <PageHeader title="Share Biscuit’s care" />
      <Card>
        <T v="h3">Coming in milestone 4</T>
        <T v="body">
          Sitter access with “what’s normal / red flags for Biscuit”, plus a vet-visit prep report summarizing everything
          since the last visit.
        </T>
      </Card>
    </Screen>
  );
}
