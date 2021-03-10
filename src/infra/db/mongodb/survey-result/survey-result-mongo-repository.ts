import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const { surveyId, accountId, answer, date } = data
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    }, {
      $set: {
        answer,
        date
      }
    }, {
      upsert: true
    })

    return await this.loadBySurveyId(surveyId)
  }

  private async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const agg = [
      {
        $match: {
          surveyId: new ObjectId(surveyId)
        }
      }, {
        $group: {
          _id: 0,
          data: {
            $push: '$$ROOT'
          },
          count: {
            $sum: 1
          }
        }
      }, {
        $unwind: {
          path: '$data'
        }
      }, {
        $lookup: {
          from: 'surveys',
          localField: 'data.surveyId',
          foreignField: '_id',
          as: 'survey'
        }
      }, {
        $unwind: {
          path: '$survey'
        }
      }, {
        $group: {
          _id: {
            surveyId: '$survey._id',
            question: '$survey.question',
            date: '$survey.date',
            total: '$count',
            answer: {
              $filter: {
                input: '$survey.answers',
                as: 'item',
                cond: {
                  $eq: [
                    '$$item.answer', '$data.answer'
                  ]
                }
              }
            }
          },
          count: {
            $sum: 1
          }
        }
      }, {
        $unwind: {
          path: '$_id.answer'
        }
      }, {
        $addFields: {
          '_id.answer.count': '$count',
          '_id.answer.percent': {
            $multiply: [
              {
                $divide: [
                  '$count', '$_id.total'
                ]
              }, 100
            ]
          }
        }
      }, {
        $group: {
          _id: {
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date'
          },
          answers: {
            $push: '$_id.answer'
          }
        }
      }, {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$answers'
        }
      }
    ]

    const surveyResult: SurveyResultModel[] = await surveyResultCollection
      .aggregate(agg)
      .toArray()

    return surveyResult?.length && surveyResult[0]
  }
}
