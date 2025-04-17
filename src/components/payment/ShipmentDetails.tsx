import { useState, useEffect, useMemo } from 'react';
import { Truck, Loader2 } from 'lucide-react';

interface ShipmentDetailsProps {
  onSubmit: (details: ShipmentFormData) => void;
}

interface Country {
  code: string;
  name: string;
  hasStates: boolean;
}

interface State {
  code: string;
  name: string;
}

export interface ShipmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Local fallback data for countries and states (pre-sorted)
const LOCAL_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', hasStates: true },
  { code: 'CA', name: 'Canada', hasStates: true },
  { code: 'GB', name: 'United Kingdom', hasStates: false },
  { code: 'AU', name: 'Australia', hasStates: true },
  { code: 'DE', name: 'Germany', hasStates: false },
  { code: 'FR', name: 'France', hasStates: false },
  { code: 'JP', name: 'Japan', hasStates: false },
  // Add more countries as needed
].sort((a, b) => a.name.localeCompare(b.name));

const LOCAL_STATES: Record<string, State[]> = {
  US: [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    // Add all US states...
  ].sort((a, b) => a.name.localeCompare(b.name)),
  CA: [
    { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' }, { code: 'MB', name: 'Manitoba' },
    // Add all Canadian provinces...
  ].sort((a, b) => a.name.localeCompare(b.name)),
  AU: [
    { code: 'NSW', name: 'New South Wales' }, { code: 'QLD', name: 'Queensland' },
    // Add Australian states...
  ].sort((a, b) => a.name.localeCompare(b.name))
};

export default function ShipmentDetails({ onSubmit }: ShipmentDetailsProps) {
  const [formData, setFormData] = useState<ShipmentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState({
    countries: true,
    states: false
  });

  // Memoized sorted countries
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

  // Memoized sorted states
  const sortedStates = useMemo(() => {
    return [...states].sort((a, b) => a.name.localeCompare(b.name));
  }, [states]);

  // Load countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name');
        if (response.ok) {
          const data = await response.json();
          const loadedCountries = data.map((c: any) => ({
            code: c.cca2,
            name: c.name.common,
            hasStates: ['US', 'CA', 'AU', 'BR', 'IN'].includes(c.cca2)
          }));
          setCountries(loadedCountries);
        } else {
          throw new Error('Failed to fetch countries');
        }
      } catch (error) {
        console.warn('Using local country data', error);
        setCountries(LOCAL_COUNTRIES);
      } finally {
        setIsLoading(prev => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) {
        setStates([]);
        return;
      }

      setIsLoading(prev => ({ ...prev, states: true }));
      setStates([]);

      try {
        const country = countries.find(c => c.code === formData.country);
        if (country?.hasStates) {
          if (LOCAL_STATES[formData.country]) {
            setStates(LOCAL_STATES[formData.country]);
          } else {
            const response = await fetch(
              `https://api.zippopotam.us/country/${formData.country.toLowerCase()}`
            );
            if (response.ok) {
              const data = await response.json();
              const uniqueStates = Array.from(
                new Set(data.places?.map((p: any) => p.state))
              ).map(state => ({ code: state, name: state }));
              setStates(uniqueStates as any);
            } else {
              throw new Error('No state data available');
            }
          }
        }
      } catch (error) {
        console.warn('Could not load states', error);
        setStates([]);
      } finally {
        setIsLoading(prev => ({ ...prev, states: false }));
      }
    };

    fetchStates();
  }, [formData.country, countries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'country' ? { state: '' } : {})
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Truck className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold">Shipping Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone*
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address*
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country*
            </label>
            {isLoading.countries ? (
              <div className="flex items-center justify-center h-10 bg-gray-100 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <select
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Country</option>
                {sortedCountries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {!formData.country ? 'State/Province*' :
               formData.country === 'US' ? 'State*' :
               formData.country === 'CA' ? 'Province*' : 'Region*'}
            </label>
            {isLoading.states ? (
              <div className="flex items-center justify-center h-10 bg-gray-100 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : sortedStates.length > 0 ? (
              <select
                name="state"
                required={!!formData.country}
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select {formData.country === 'US' ? 'State' : 'Province'}</option>
                {sortedStates.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="state"
                required={!!formData.country}
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP/Postal Code*
          </label>
          <input
            type="text"
            name="zipCode"
            required
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Truck className="h-5 w-5" />
          <span>Continue to Payment</span>
        </button>
      </form>
    </div>
  );
}