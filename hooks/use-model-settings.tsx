import { useEffect, useState } from "react";

import { defaultPreferences, usePreferences } from "./use-preferences";
import { TModel, useModelList } from "./use-model-list";
import { useFormik } from "formik";

export type TModelSettings = {
  refresh?: boolean;
};

export const useModelSettings = ({ refresh }: TModelSettings) => {
  const [selectedModel, setSelectedModel] = useState<TModel>();
  const { getPreferences, setPreferences } = usePreferences();
  const { getModelByKey } = useModelList();

  const formik = useFormik({
    initialValues: {
      systemPrompt: "",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1,
      topK: 5,
      maxTokens: 1000,
    },
    onSubmit: (values) => {},
  });

  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedModel(getModelByKey(preferences.defaultModel));
      formik.setFieldValue(
        "systemPrompt",
        preferences.systemPrompt || defaultPreferences.systemPrompt
      );
      formik.setFieldValue(
        "messageLimit",
        preferences.messageLimit || defaultPreferences.messageLimit
      );
      formik.setFieldValue(
        "temperature",
        preferences.temperature || defaultPreferences.temperature
      );
      formik.setFieldValue("topP", preferences.topP || defaultPreferences.topP);
      formik.setFieldValue("topK", preferences.topK || defaultPreferences.topK);
      formik.setFieldValue(
        "maxTokens",
        preferences.maxTokens || defaultPreferences.maxTokens
      );
    });
  }, [refresh]);

  return {
    formik,
    setPreferences,
    selectedModel,
  };
};
