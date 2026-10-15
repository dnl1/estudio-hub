import { Playhead } from "@/components/playhead";
import { bookingKindLabel, nightGrid } from "@/components/site-content";

const hourLabel = (hour: number) => `${String(hour % 24).padStart(2, "0")}h`;

export function NightGrid() {
  const { caption, startHour, endHour, rooms, bookings } = nightGrid;
  const span = endHour - startHour;
  const hours = Array.from({ length: span + 1 }, (_, index) => startHour + index);
  const percent = (hour: number) => ((hour - startHour) / span) * 100;

  return (
    <figure className="night-grid">
      <figcaption className="night-grid__caption">{caption}</figcaption>
      <div className="night-grid__board">
        <div className="night-grid__ruler" aria-hidden="true">
          {hours.map((hour) => (
            <span key={hour} style={{ left: `${percent(hour)}%` }}>
              {hourLabel(hour)}
            </span>
          ))}
        </div>
        {rooms.map((room) => (
          <div className="night-grid__room" key={room}>
            <span className="night-grid__room-name" aria-hidden="true">
              {room}
            </span>
            <ul className="night-grid__track" aria-label={room}>
              {bookings
                .filter((booking) => booking.room === room)
                .map((booking) => (
                  <li
                    key={`${room}-${booking.start}`}
                    className={`booking booking--${booking.kind}`}
                    style={{
                      left: `${percent(booking.start)}%`,
                      width: `calc(${(booking.end - booking.start) * (100 / span)}% - 4px)`
                    }}
                  >
                    <span className="booking__label">{booking.label}</span>
                    <span className="booking__kind">{bookingKindLabel[booking.kind]}</span>
                    <span className="sr-only">
                      , das {hourLabel(booking.start)} às {hourLabel(booking.end)}
                    </span>
                    {booking.tab ? <span className="booking__tab">{booking.tab}</span> : null}
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <Playhead startHour={startHour} endHour={endHour} />
      </div>
    </figure>
  );
}
