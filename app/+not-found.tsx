import { Link } from 'expo-router';

import { Card, Screen, T } from '@/src/ui/components';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Card>
        <T v="h3">This screen doesn’t exist.</T>
        <Link href="/">
          <T v="body">Go to home screen</T>
        </Link>
      </Card>
    </Screen>
  );
}
