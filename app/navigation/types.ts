import { FormData } from '../tabs/ai';

export type RootStackParamList = {
  Main: undefined;
  LessonResult: {
    formData: FormData;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Dummy component to satisfy router requirements
const DummyComponent = () => null;

export default DummyComponent; 