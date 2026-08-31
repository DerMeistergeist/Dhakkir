import React, { useState } from "react";
import { t } from "../../theme";
import useQuranData from "../../hooks/useQuranData";
import SurahIndex from "./SurahIndex";
import MushafPage from "./MushafPage";
import QuranSearchView from "./QuranSearchView";
import AyahView from "./AyahView";

export default function QuranSection({ lang, lastPage, setLastPage, onOpenSettings, onFullscreenChange }) {
  const [view, setView] = useState("index");
  const [currentPage, setCurrentPage] = useState(lastPage || 1);
  const [currentAyah, setCurrentAyah] = useState(null); // {sura, ayah}
  const [highlightAyah, setHighlightAyah] = useState(null); // ayah to highlight when opening a page from search/ayah view
  const [searchQuery, setSearchQuery] = useState("");

  var data = useQuranData();

  if (!data) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#9a8878", fontSize: 13 }}>
        {t(lang, "جاري تحميل المصحف...", "Loading the Mushaf...", "Der Mushaf wird geladen...")}
      </div>
    );
  }

  function openPage(pageNumber, highlight) {
    setCurrentPage(pageNumber);
    setLastPage(pageNumber);
    setHighlightAyah(highlight || null);
    setView("page");
  }

  function openAyah(pointer) {
    setCurrentAyah(pointer);
    setView("ayah");
  }

  if (view === "search") {
    return (
      <QuranSearchView
        lang={lang}
        text={data.TEXT}
        surahs={data.SURAHS}
        pageOfAyah={data.pageOfAyah}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSelectResult={openAyah}
        onBack={function () {
          setView("index");
        }}
      />
    );
  }

  if (view === "ayah" && currentAyah) {
    return (
      <AyahView
        lang={lang}
        sura={currentAyah.sura}
        ayah={currentAyah.ayah}
        text={data.TEXT}
        surahs={data.SURAHS}
        pageOfAyah={data.pageOfAyah}
        onNavigate={openAyah}
        onViewInPage={function (pageNumber) {
          openPage(pageNumber, currentAyah);
        }}
        onBack={function () {
          setView("search");
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
        juz={data.PAGE_JUZ[currentPage - 1]}
        hizb={data.PAGE_HIZB[currentPage - 1]}
        highlightAyah={highlightAyah}
        onFullscreenChange={onFullscreenChange}
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
