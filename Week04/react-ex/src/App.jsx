import React, { useEffect, useState } from "react";
import axios from "axios";

const categoryName = {
  TMP: "기온",
  UUU: "동서바람성분",
  VVV: "남북바람성분",
  VEC: "풍향",
  WSD: "풍속",
  SKY: "하늘상태",
  PTY: "강수형태",
  POP: "강수확률",
  PCP: "1시간 강수량",
  REH: "습도",
  SNO: "1시간 신적설",
  TMN: "일 최저기온",
  TMX: "일 최고기온",
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}${month}${date}`;
}

function App() {
  const [items, setItems] = useState([]);
  const [baseDate, setBaseDate] = useState(getTodayDate());
  const [baseTime, setBaseTime] = useState("0500");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(import.meta.env.VITE_API_URL, {
        params: {
          serviceKey: import.meta.env.VITE_API_KEY,
          numOfRows: 20,
          pageNo: 1,
          dataType: "JSON",
          base_date: baseDate,
          base_time: baseTime,
          nx: 60,
          ny: 127,
        },
      });

      console.log(response.data);

      const resultCode = response.data?.response?.header?.resultCode;
      const resultMsg = response.data?.response?.header?.resultMsg;

      if (resultCode !== "00") {
        setItems([]);
        setErrorMessage(`API 응답 오류: ${resultMsg}`);
        return;
      }

      const data = response.data?.response?.body?.items?.item;

      if (!data || data.length === 0) {
        setItems([]);
        setErrorMessage("조회된 예보 데이터가 없습니다.");
        return;
      }

      setItems(data);
    } catch (error) {
      console.error("API 요청 실패:", error);
      setItems([]);
      setErrorMessage(
        "데이터를 불러오지 못했습니다. API 키, 활용신청 승인 여부, 요청 날짜/시간을 확인해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-3xl bg-white p-7 shadow-md">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            공공데이터포털 API 연동 과제
          </p>

          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            기상청 단기예보 조회
          </h1>

          <p className="text-slate-600">
            기상청 단기예보 API를 axios와 useEffect로 연동하여 서울 기준
            예보 데이터를 화면에 출력합니다.
          </p>
        </header>

        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                발표일자
              </label>
              <input
                value={baseDate}
                onChange={(event) => setBaseDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="YYYYMMDD"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                발표시각
              </label>
              <select
                value={baseTime}
                onChange={(event) => setBaseTime(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="0200">0200</option>
                <option value="0500">0500</option>
                <option value="0800">0800</option>
                <option value="1100">1100</option>
                <option value="1400">1400</option>
                <option value="1700">1700</option>
                <option value="2000">2000</option>
                <option value="2300">2300</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={fetchWeather}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                단기예보 불러오기
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            현재 예보지점은 서울 기준 nx=60, ny=127로 설정했습니다.
          </p>
        </section>

        {loading && (
          <div className="mb-6 rounded-2xl bg-blue-50 p-5 text-center font-semibold text-blue-700">
            예보 데이터를 불러오는 중입니다...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-red-50 p-5 text-center font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        {!loading && items.length > 0 && (
          <section>
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                서울 단기예보 데이터
              </h2>

              <p className="text-sm text-slate-500">
                총 {items.length}개 예보 항목 표시
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <article
                  key={`${item.category}-${item.fcstDate}-${item.fcstTime}-${index}`}
                  className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-blue-600">
                      {categoryName[item.category] || item.category}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {item.fcstValue}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      예보 날짜: {item.fcstDate}
                    </p>
                    <p className="text-sm text-slate-600">
                      예보 시각: {item.fcstTime}
                    </p>
                    <p className="text-sm text-slate-600">
                      항목 코드: {item.category}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;