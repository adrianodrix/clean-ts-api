import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyModel, mockSurveyResultModel } from '@/domain/test'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyResultRepo } from '../protocols/db/survey-result/load-survey-result-repo'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repo'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepo } from '../protocols/db/survey/load-surveys-by-id-repository'

export const mockAAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepo = (): LoadSurveyByIdRepo => {
  class LoadSurveyByIdRepoStub implements LoadSurveyByIdRepo {
    async loadById (id: String): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepoStub()
}

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepoStub = (): LoadSurveyResultRepo => {
  class LoadSurveyResultRepoStub implements LoadSurveyResultRepo {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRepoStub()
}
