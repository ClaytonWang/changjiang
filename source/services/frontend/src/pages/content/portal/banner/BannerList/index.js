import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { AuthButton } from '@/common/components';
import { EDIT } from '@/common/constants';
import PERMISSION_MAP from '@/common/utils/permissions';
import BannerTable from '../BannerTable';
import './index.less';

const BannerList = ({ tableData, loading }) => {
  const navigate = useNavigate();

  const handleEditClicked = useCallback(() => {
    navigate(`banner/${EDIT}`, {
      state: {
        type: EDIT,
        data: tableData,
      },
    });
  }, [tableData, navigate]);

  return (
    <div className="portal-list">
      <div className="table-container">
        <div className="batch-command">
          <AuthButton
            required={PERMISSION_MAP.CONTENT_PORTAL_EDIT}
            style={{ float: 'left' }}
            type="primary"
            onClick={handleEditClicked}
            disabled={loading}
          >
            <PlusOutlined />
            编辑
          </AuthButton>
        </div>
        <BannerTable data={tableData} loading={loading} />
      </div>
    </div>
  );
};
export default BannerList;
