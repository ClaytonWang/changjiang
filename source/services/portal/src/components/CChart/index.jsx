import { lazy, Suspense } from 'react';
import { get } from 'lodash';

const NetMapChart = lazy(() => import('./NetMapChart'));
const PackingChart = lazy(() => import('./PackingChart'));
const TsptwChart = lazy(() => import('./TsptwChart'));
const TageChart = lazy(() => import('./TageChart'));

const Charts = {
  Net: NetMapChart,
  Packing: PackingChart,
  Tsptw: TsptwChart,
  Tage: TageChart,
};

const CChart = ({ model, value }) => {
  if (!model || !value) {
    return null;
  }
  return (
    <div>
      <Suspense>
        {get(
          {
            net: <Charts.Net value={value} />,
            packing: <Charts.Packing value={value} />,
            tsptw: <Charts.Tsptw value={value} />,
            tage: <Charts.Tage map={model?.map} value={value} />,
          },
          model.category,
          null
        )}
      </Suspense>
    </div>
  );
};

export default CChart;
