
import { UserRole } from '@/types/user';

export const rolePermissions = {
  [UserRole.ADMIN]: [
    'view_users',
    'add_user',
    'update_user',
    'delete_user',
    'monitor_bugs',
    'monitor_testers',
    'monitor_developers',
    'manage_users',
    'view_analytics',
    'manage_settings',
    'view_reports',
    'create_bugs',
    'view_created_bugs',
    'assign_bugs',
    'view_developers',
    'host_chat',
    'attach_files',
    'send_notifications',
    'view_assigned_bugs',
    'update_bug_status',
    'finish_bug',
    'join_chat',
    'search_bugs',
    'view_docs',
    'export_users',
    'import_users'
  ],
  [UserRole.PROJECT_MANAGER]: [
    'check_performance',
    'monitor_bugs',
    'monitor_developers',
    'monitor_testers',
    'view_analytics',
    'view_reports',
    'manage_settings',
    'assign_bugs',
    'view_assigned_bugs',
    'view_created_bugs'
  ],
  [UserRole.DEVELOPER]: [
    'view_assigned_bugs',
    'update_bug_status',
    'finish_bug',
    'join_chat',
    'search_bugs',
    'view_docs'
  ],
  [UserRole.TESTER]: [
    'create_bugs',
    'view_created_bugs',
    'assign_bugs',
    'view_developers',
    'host_chat',
    'attach_files',
    'send_notifications'
  ]
} as const;

