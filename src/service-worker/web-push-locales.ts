import fs from 'node:fs';
import path from 'path';

const filtered: Record<string, Record<string, string>> = {};
const filenames = fs.readdirSync(path.resolve(__dirname, '../locales'));

filenames.forEach(filename => {
  if (!filename.match(/\.json$/) || filename.match(/defaultMessages|whitelist/)) return;

  const content = fs.readFileSync(path.resolve(__dirname, `../locales/${filename}`), 'utf-8');
  const full    = JSON.parse(content) as Record<string, string>;
  const locale  = filename.split('.')[0];

  filtered[locale] = {
    'notification.like': full['notification.like'] || '',
    'notification.follow': full['notification.follow'] || '',
    'notification.follow_request': full['notification.follow_request'] || '',
    'notification.mention': full['notification.mention'] || '',
    'notification.repost': full['notification.repost'] || '',
    'notification.poll': full['notification.poll'] || '',
    'notification.status': full['notification.status'] || '',
    'notification.move': full['notification.move'] || '',
    'notification.user_approved': full['notification.user_approved'] || '',

    'notification.pleroma:chat_mention': full['notification.pleroma:chat_mention'] || '',

    'status.show_more': full['status.show_more'] || '',
    'status.repost': full['status.repost'] || '',
    'status.like': full['status.like'] || '',

    'notifications.group': full['notifications.group'] || '',
  };
});

export default () => ({
  data: filtered,
});