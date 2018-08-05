import Config from '../../models/config'
import ConfigService from '../config'
import Google from '../../models/adapters/google'
import Office from '../../models/adapters/office'
import { Credentials } from '../../../node_modules/aws-sdk'

export default class EnvConfigService extends ConfigService {
  load(): Promise<Config> {
    return new Promise(resolve => {
      const config = new Config()

      // Google Spreadsheet adapter
      if (
        process.env.ResultStorageGoogleSpreadsheetId &&
        process.env.ResultStorageGoogleSpreadsheetCredentials
      ) {
        config.addAdapter(
          new Google(process.env.ResultStorageGoogleSpreadsheetId, {
            credentials: process.env.ResultStorageGoogleSpreadsheetCredentials
          })
        )
      } else {
        // Legacy Google Spreadsheet adapter
        if (process.env.StorageDocumentId && process.env.StorageDocumentCredentials) {
          config.addAdapter(
            new Google(process.env.StorageDocumentId, {
              credentials: process.env.StorageDocumentCredentials
            })
          )
        }
      }

      // Office365 Excel sheet adapter
      if (process.env.ResultStorageExcelSpreadsheetId) {
        const configProcess = {
          credentials: {
            SheetName: process.env.ResultStorageExcelSheetName,
            ClientId: process.env.ResultStorageClientId,
            ClientSecret: process.env.ResultStorageClientSecret,
            RefreshToken: process.env.ResultStorageRefreshToken,
            // if max colmuns not specified, set default value of 64
            MaxColumns: process.env.ResultStorageMaximumColumns || 64
          }
        }
        config.addAdapter(new Office(process.env.ResultStorageExcelSpreadsheetId, configProcess))
      }

      resolve(config)
    })
  }

  save(config: Config): void {
    throw new Error('Env config service is read-only.')
  }
}
