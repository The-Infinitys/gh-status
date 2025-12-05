import * as fs from "fs";
import * as path from "path";
import { Config } from "./config";

// キャッシュディレクトリのパス
const CACHE_DIR = ".cache";

interface CacheEntry<T> {
  timestamp: number; // キャッシュ保存時のタイムスタンプ (UNIXエポックミリ秒)
  data: T;
}

/**
 * キャッシュディレクトリのフルパスを解決し、存在しない場合は作成します。
 * @returns キャッシュディレクトリのフルパス
 */
function getCacheDirPath(): string {
  const cachePath = path.resolve(process.cwd(), CACHE_DIR);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
  }
  return cachePath;
}

/**
 * APIパスに基づいてキャッシュファイルのパスを生成します。
 * ファイル名には安全なハッシュを使用することを検討することもできますが、
 * シンプルな例としてパスをエスケープして使用します。
 * @param apiPath APIエンドポイントのパス (例: /users/username)
 * @returns キャッシュファイルのフルパス
 */
function getCacheFilePath(apiPath: string): string {
  const cacheKey = apiPath.replace(/[^a-zA-Z0-9]/g, "_"); // パスをファイル名として安全な形式に変換
  return path.join(getCacheDirPath(), `${cacheKey}.json`);
}

/**
 * キャッシュの有効期限をミリ秒で計算します。
 * @param duration 有効期限の数値
 * @param unit 有効期限の単位
 * @returns ミリ秒単位の有効期限
 */
function getExpiryTimeMs(duration: number, unit: Config["cacheUnit"]): number {
  switch (unit) {
    case "seconds":
      return duration * 1000;
    case "minutes":
      return duration * 1000 * 60;
    case "hours":
      return duration * 1000 * 60 * 60;
    case "days":
      return duration * 1000 * 60 * 60 * 24;
    case "weeks":
      return duration * 1000 * 60 * 60 * 24 * 7;
    case "months":
      return duration * 1000 * 60 * 60 * 24 * 30; // 簡易的な計算
    case "years":
      return duration * 1000 * 60 * 60 * 24 * 365; // 簡易的な計算
    default:
      return 0; // 無効な単位の場合はキャッシュしない
  }
}

/**
 * キャッシュからデータを読み込みます。
 * 有効期限が切れている場合はnullを返します。
 * @param apiPath APIエンドポイントのパス
 * @param config 設定情報 (キャッシュ期間と単位を含む)
 * @returns キャッシュされたデータ、またはnull
 */
export function readCache<T>(apiPath: string, config: Config): T | null {
  const filePath = getCacheFilePath(apiPath);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const cacheEntry: CacheEntry<T> = JSON.parse(fileContent);

    const expiryTimeMs = getExpiryTimeMs(config.cacheDuration || 0, config.cacheUnit);
    if (expiryTimeMs === 0) {
      // キャッシュ無効
      console.log(`Cache disabled for ${apiPath}`);
      return null;
    }

    const now = Date.now();
    if (now - cacheEntry.timestamp < expiryTimeMs) {
      console.log(`Cache hit for ${apiPath}`);
      return cacheEntry.data;
    } else {
      console.log(`Cache expired for ${apiPath}`);
      // キャッシュが期限切れの場合はファイルを削除しても良いが、ここでは読み込まないだけ
      return null;
    }
  } catch (error) {
    console.error(`Error reading cache for ${apiPath}: ${error}`);
    return null;
  }
}

/**
 * データをキャッシュに書き込みます。
 * @param apiPath APIエンドポイントのパス
 * @param data キャッシュするデータ
 */
export function writeCache<T>(apiPath: string, data: T): void {
  const filePath = getCacheFilePath(apiPath);
  const cacheEntry: CacheEntry<T> = {
    timestamp: Date.now(),
    data: data,
  };
  try {
    fs.writeFileSync(filePath, JSON.stringify(cacheEntry), "utf8");
    console.log(`Cache written for ${apiPath}`);
  } catch (error) {
    console.error(`Error writing cache for ${apiPath}: ${error}`);
  }
}
