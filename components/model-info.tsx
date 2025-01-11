import { formatNumber } from "@/lib/helper";
import { TModel } from "@/hooks/use-model-list";

export type TModelInfo = {
  model: TModel;
};

export const ModelInfo = ({ model }: TModelInfo) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 text-sm items-center pb-2">
        {model.icon()} {model.name}
      </div>
      <div className="flex flex-row justify-between text-xs text-zinc-600 dark:text-zinc-400">
        <p>Tokens</p> <p>{formatNumber(model.tokens)} tokens</p>
      </div>
      <div className="flex flex-row justify-between text-xs text-zinc-600 dark:text-zinc-400">
        <p>Model</p> <p>{model.key}</p>
      </div>
      {model.inputPrice && (
        <div className="flex flex-row justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <p>Input Price</p> <p>{model.inputPrice} USD / 1M tokens</p>
        </div>
      )}
      {model.outputPrice && (
        <div className="flex flex-row justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <p>Output Price</p> <p>{model.outputPrice} USD / 1M tokens</p>
        </div>
      )}
    </div>
  );
};
