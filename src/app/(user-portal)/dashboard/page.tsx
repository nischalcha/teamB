import { getPayload } from 'payload';
import config from '@payload-config';
import { getCurrentUser } from '@/lib/auth';
import { BookingForm } from '@/components/BookingForm';

export default async function UserDashboard() {
  const user = await getCurrentUser();
  const payload = await getPayload({ config });

  const { docs: locations } = await payload.find({
    collection: 'locations',
    limit: 20,
    depth: 0,
  });

  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 10,
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-black/50">
          Book a court or view our services below.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        {/* Booking Form - Main area */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-black">
                Book a Court
              </h2>
              <p className="mt-1 text-sm text-black/70">
                Fill in the form below and we&apos;ll get back to you to confirm your booking.
              </p>
            </div>
            <BookingForm
              locations={locations.map((l) => ({ id: l.id, name: l.name }))}
            />
          </div>
        </div>

        {/* Sidebar - Services & Info */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black">
              Pricing
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-lg border border-black/10 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-black">
                      {service.name}
                    </p>
                    <p className="text-xs text-black/70">
                      {service.timing === 'morning' ? 'Morning' : 'Evening'} sessions
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary">
                    NPR {service.price?.toLocaleString()}/{service.pricingUnit}
                  </p>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-sm text-black/70">No services available yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black">
              Locations
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-lg border border-black/10 p-3"
                >
                  <p className="text-sm font-medium text-black">
                    {location.name}
                  </p>
                  <p className="text-xs text-black/70">
                    {location.address}
                  </p>
                </div>
              ))}
              {locations.length === 0 && (
                <p className="text-sm text-black/70">No locations yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
