"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { X, Calendar as CalendarIcon, MapPin, Award } from "lucide-react";
import { Kegiatan } from "@/types";

const locales = {
  id: id,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface KalenderProkerProps {
  kegiatanList: Kegiatan[];
}

interface CalendarEvent extends Event {
  resource: Kegiatan;
}

export default function KalenderProker({ kegiatanList }: KalenderProkerProps) {
  const [selectedEvent, setSelectedEvent] = useState<Kegiatan | null>(null);

  // Map database entries to calendar format events
  const events: CalendarEvent[] = kegiatanList.map((keg) => ({
    id: keg.id,
    title: keg.nama,
    start: new Date(keg.tanggal_mulai),
    end: new Date(keg.tanggal_selesai),
    resource: keg,
  }));

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
  };

  const eventPropGetter = () => {
    return {
      style: {
        backgroundColor: "#990808", // brand.primary
        borderRadius: "6px",
        opacity: 0.95,
        color: "white",
        border: "0px",
        display: "block",
        padding: "2px 6px",
      },
    };
  };

  return (
    <div className="w-full bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm mb-12">
      {/* Calendar Grid wrapper */}
      <div className="h-[600px] text-sm">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          views={["month", "agenda"]}
          defaultView="month"
          culture="id"
          messages={{
            next: "Berikutnya",
            previous: "Sebelumnya",
            today: "Hari Ini",
            month: "Bulanan",
            agenda: "Agenda",
            noEventsInRange: "Tidak ada kegiatan dalam periode ini.",
          }}
        />
      </div>

      {/* Pop-up Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-neutral-100 relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-primary mb-3">
                {selectedEvent.kementerian}
              </span>
              <h4 className="text-lg font-bold text-neutral-900 font-poppins leading-snug">
                {selectedEvent.nama}
              </h4>

              <div className="mt-6 space-y-4 border-t border-neutral-100 pt-4 text-xs sm:text-sm text-neutral-600">
                <div className="flex gap-3">
                  <CalendarIcon className="h-5 w-5 stroke-[1.5] text-neutral-400 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-800 block text-[10px] uppercase tracking-wider">
                      Waktu Pelaksanaan:
                    </span>
                    <p className="mt-0.5">
                      {format(
                        new Date(selectedEvent.tanggal_mulai),
                        "d MMMM yyyy, HH:mm",
                        { locale: id }
                      )}
                      {" s/d "}
                      {format(
                        new Date(selectedEvent.tanggal_selesai),
                        "d MMMM yyyy, HH:mm",
                        { locale: id }
                      )}
                    </p>
                  </div>
                </div>

                {selectedEvent.lokasi && (
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 stroke-[1.5] text-neutral-400 shrink-0" />
                    <div>
                      <span className="font-bold text-neutral-800 block text-[10px] uppercase tracking-wider">
                        Lokasi:
                      </span>
                      <p className="mt-0.5">{selectedEvent.lokasi}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Award className="h-5 w-5 stroke-[1.5] text-neutral-400 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-800 block text-[10px] uppercase tracking-wider">
                      Deskripsi Kegiatan:
                    </span>
                    <p className="mt-0.5 leading-relaxed">
                      {selectedEvent.deskripsi}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
