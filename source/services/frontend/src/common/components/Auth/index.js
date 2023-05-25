import { useAuth } from '@/common/hooks/useAuth';
const Auth = ({ required, children, condition }) => {
  const { user, hasPermission } = useAuth();
  if (required) {
    return hasPermission(required);
  }
  if (condition) {
    return condition(user, children);
  }
  console.error('missing props required or condition');
};
export default Auth;
