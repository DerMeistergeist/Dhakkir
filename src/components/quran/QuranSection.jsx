import React, { useState } from "react";
import { t } from "../../theme";
import useQuranData from "../../hooks/useQuranData";
import SurahIndex from "./SurahIndex";
import MushafPage from "./MushafPage";
import QuranSearchView from "./QuranSearchView";

export default function QuranSection({ lang, lastPage, setLastPage, onOpenSettings }) {
  const [view, setView] = useState("index");
  const [currentPage, setCurrentPage] = useState(lastPage || 1);

  var data = useQuranData();

  if (!data) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#9a8878", fontSize: 13 }}>
        {t(lang, "جاري تحميل المصحف...", "Loading the Mushaf...", "Der Mushaf wird geladen...")}
      </div>
    );
  }

  function openPage(pageNumber) {
    setCurrentPage(pageNumber);
    setLastPage(pageNumber);
    setView("page");
  }

  if (view === "search") {
    return (
      <QuranSearchView
        lang={lang}
        text={data.TEXT}
        surahs={data.SURAHS}
        pageOfAyah={data.pageOfAyah}
        onSelectResult={openPage}
        onBack={function () {
          setView("index");
        }}
      />
    );
  }

  if (view === "page") {
    return (
      <MushafPage
        lang={lang}
        pageNumber={currentPage}
        totalPages={data.PAGES.length}
        ayahs={data.PAGES[currentPage - 1]}
        text={data.TEXT}
        surahs={data.SURAHS}
        onPrev={function () {
          if (currentPage > 1) openPage(currentPage - 1);
        }}
        onNext={function () {
          if (currentPage < data.PAGES.length) openPage(currentPage + 1);
        }}
        onGoToPage={openPage}
        onBack={function () {
          setView("index");
        }}
        onOpenSettings={onOpenSettings}
      />
    );
  }

  return (
    <SurahIndex
      lang={lang}
      surahs={data.SURAHS}
      lastPage={lastPage}
      onOpenSurah={function (surah) {
        openPage(surah.startPage);
      }}
      onContinueReading={function () {
        openPage(lastPage);
      }}
      onOpenSearch={function () {
        setView("search");
      }}
    />
  );
}
