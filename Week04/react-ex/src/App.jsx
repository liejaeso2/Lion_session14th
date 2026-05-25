import React, { useEffect, useState } from "react";
import axios from "axios";

const areaList = [
  { name: "서울", code: "1" },
  { name: "인천", code: "2" },
  { name: "대전", code: "3" },
  { name: "대구", code: "4" },
  { name: "광주", code: "5" },
  { name: "부산", code: "6" },
  { name: "울산", code: "7" },
  { name: "세종", code: "8" },
  { name: "경기", code: "31" },
  { name: "강원", code: "32" },
  { name: "충북", code: "33" },
  { name: "충남", code: "34" },
  { name: "경북", code: "35" },
  { name: "경남", code: "36" },
  { name: "전북", code: "37" },
  { name: "전남", code: "38" },
  { name: "제주", code: "39" },
];

const contentTypeList = [
  { name: "관광지", code: "12" },
  { name: "문화시설", code: "14" },
  { name: "축제/공연/행사", code: "15" },
  { name: "여행코스", code: "25" },
  { name: "레포츠", code: "28" },
  { name: "숙박", code: "32" },
  { name: "쇼핑", code: "38" },
  { name: "음식점", code: "39" },
];

function App() {
  const [areaCode, setAreaCode] = useState("1");
  const [contentTypeId, setContentTypeId] = useState("12");
  const [tourList, setTourList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedAreaName =
    areaList.find((area) => area.code === areaCode)?.name || "서울";

  const selectedTypeName =
    contentTypeList.find((type) => type.code === contentTypeId)?.name ||
    "관광지";

  const fetchTourData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(import.meta.env.VITE_API_URL, {
        params: {
          serviceKey: import.meta.env.VITE_API_KEY,
          MobileOS: "ETC",
          MobileApp: "LionSession",
          _type: "json",
          numOfRows: 12,
          pageNo: 1,
          arrange: "Q",
          areaCode: areaCode,
          contentTypeId: contentTypeId,
        },
      });

      const resultCode = response.data?.response?.header?.resultCode;
      const resultMsg = response.data?.response?.header?.resultMsg;

      if (resultCode !== "0000") {
        setTourList([]);
        setErrorMessage(`API 응답 오류: ${resultMsg || "알 수 없는 오류"}`);
        return;
      }

      const items = response.data?.response?.body?.items?.item;

      if (!items || items.length === 0) {
        setTourList([]);
        setErrorMessage("조회된 관광 정보가 없습니다.");
        return;
      }

      setTourList(Array.isArray(items) ? items : [items]);
    } catch (error) {
      console.error("API 요청 실패:", error);
      setTourList([]);
      setErrorMessage(
        "데이터를 불러오지 못했습니다. API 키, 활용신청 승인 여부, 네트워크 상태를 확인해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourData();
  }, [areaCode, contentTypeId]);

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl bg-white p-7 text-center shadow-md">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            공공데이터포털 API 연동 과제
          </p>

          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            국내 관광정보 조회
          </h1>

          <p className="text-slate-600">
            한국관광공사 국문 관광정보 서비스 API를 axios와 useEffect로
            연동하여 지역별 관광 정보를 화면에 출력합니다.
          </p>
        </header>

        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                지역 선택
              </label>
              <select
                value={areaCode}
                onChange={(event) => setAreaCode(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500"
              >
                {areaList.map((area) => (
                  <option key={area.code} value={area.code}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                관광 유형
              </label>
              <select
                value={contentTypeId}
                onChange={(event) => setContentTypeId(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500"
              >
                {contentTypeList.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={fetchTourData}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                다시 불러오기
              </button>
            </div>
          </div>
        </section>

        {loading && (
          <div className="mb-6 rounded-2xl bg-blue-50 p-5 text-center font-semibold text-blue-700">
            관광 정보를 불러오는 중입니다...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-red-50 p-5 text-center font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        {!loading && tourList.length > 0 && (
          <section>
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedAreaName} {selectedTypeName} 목록
              </h2>

              <p className="text-sm text-slate-500">
                총 {tourList.length}개 항목 표시
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tourList.map((item, index) => (
                <article
                  key={`${item.contentid}-${index}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {item.firstimage ? (
                    <img
                      src={item.firstimage}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-slate-200 text-sm font-semibold text-slate-500">
                      이미지 없음
                    </div>
                  )}

                  <div className="p-5">
                    <p className="mb-2 text-sm font-bold text-blue-600">
                      {selectedTypeName}
                    </p>

                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      {item.title || "제목 정보 없음"}
                    </h3>

                    <p className="mb-4 text-sm leading-6 text-slate-600">
                      {item.addr1 || "주소 정보가 없습니다."}
                    </p>

                    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p>지역: {selectedAreaName}</p>
                      <p>콘텐츠 ID: {item.contentid || "-"}</p>
                      <p>전화번호: {item.tel || "정보 없음"}</p>
                    </div>
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