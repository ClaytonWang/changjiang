import { lazy, Suspense } from 'react';
import { get } from 'lodash';

const NetEffect = lazy(() => import('./NetEffect'));
const PackingEffect = lazy(() => import('./PackingEffect'));
const TsptwEffect = lazy(() => import('./TsptwEffect'));
const TageEffect = lazy(() => import('./TageEffect'));

const Effects = {
  Net: NetEffect,
  Packing: PackingEffect,
  Tsptw: TsptwEffect,
  Tage: TageEffect,
};

const CEffect = ({ model, data }) => {
  if (!model || !data) {
    return null;
  }
  return (
    <div>
      <Suspense>
        {get(
          {
            net: <Effects.Net model={model} data={data} />,
            packing: <Effects.Packing model={model} data={data} />,
            tsptw: <Effects.Tsptw model={model} data={data} />,
            tage: <Effects.Tage model={model} data={data} />,
          },
          model.category,
          null
        )}
      </Suspense>
    </div>
  );
};

export default CEffect;
