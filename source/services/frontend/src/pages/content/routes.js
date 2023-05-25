import { Navigate, Route, Routes } from 'react-router-dom';
import PortalList from './portal';
import BannerEdit from './portal/banner/BannerEdit';
import FeatureEdit from './portal/feature/FeatureEdit';
import SpecialEdit from './portal/special/SpecialEdit';
import TagList from './tag/TagList';
import ModelList from './model/ModelList';
import ModelEdit from './model/ModelEdit';

const ContentRoutes = () => (
  <Routes>
    <Route path="" element={<Navigate to="portal" />} />

    <Route path="portal" element={<PortalList />} />
    <Route path="portal/banner/edit" element={<BannerEdit />} />
    <Route path="portal/feature/edit" element={<FeatureEdit />} />
    <Route path="portal/special/edit" element={<SpecialEdit />} />

    <Route path="model" element={<ModelList />} />
    <Route path="model/:action/:id?" element={<ModelEdit />} />

    <Route path="tag" element={<TagList />} />
  </Routes>
);
export default ContentRoutes;

export const ContentPages = [
  PortalList,
  BannerEdit,
  ModelEdit,
  FeatureEdit,
  SpecialEdit,
];
