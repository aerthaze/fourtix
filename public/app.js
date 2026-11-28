
    const EVENT_IMAGES = {
      1: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=70',
      2: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=70',
      3: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=70',
      4: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=70',
    };
    function eventImage(id, type) {
      return EVENT_IMAGES[id] || (type === 'cinema'
        ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=70'
        : 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=900&q=70');
    }

    const FOURTIX_CONFIG = {
      paymentTtlMinutes: 15,
      maxTicketsPerEvent: 4,
    };

    function offsetDate({ days = 0, hours = 0, minutes = 0 } = {}) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      d.setHours(d.getHours() + hours);
      d.setMinutes(d.getMinutes() + minutes);
      return d.toISOString();
    }

    function createInitialMockDb() {
      return {
        nextIds: { users: 6, venues: 5, events: 6, tickets: 11, bookings: 5 },
        users: [
          { id: 1, name: 'Farras', email: 'admin@fourtix.id', password: 'password123', role: 'admin' },
          { id: 2, name: 'Nabila EO', email: 'nabila@fourtix.id', password: 'password123', role: 'organizer' },
          { id: 3, name: 'Novi EO', email: 'novi@fourtix.id', password: 'password123', role: 'organizer' },
          { id: 4, name: 'Nova Amelia', email: 'nova@test.com', password: 'password123', role: 'customer' },
          { id: 5, name: 'Marcello', email: 'marcello@test.com', password: 'password123', role: 'customer' },
        ],
        venues: [
          { id: 1, name: 'XXI Ayani Mega Mall', address: 'Jl. Ahmad Yani No. 4', city: 'Pontianak', deleted_at: null },
          { id: 2, name: 'Gedung Olahraga Pontianak', address: 'Jl. Sultan Abdurrahman', city: 'Pontianak', deleted_at: null },
          { id: 3, name: 'Stadion Madya GBK', address: 'Jl. Pintu Satu Senayan', city: 'Jakarta', deleted_at: null },
          { id: 4, name: 'Auditorium Untan (Lama)', address: 'Jl. Prof. Dr. H. Hadari Nawawi', city: 'Pontianak', deleted_at: offsetDate({ days: -12 }) },
        ],
        events: [
          {
            id: 1,
            venue_id: 1,
            organizer_id: 2,
            title: 'Dune: Messiah IMAX Premiere',
            type: 'cinema',
            event_date: offsetDate({ days: 5, hours: 3 }),
            studio: 'Studio 1 IMAX',
            deleted_at: null,
          },
          {
            id: 2,
            venue_id: 2,
            organizer_id: 2,
            title: 'Equatorial Indie Fest 2026',
            type: 'concert',
            event_date: offsetDate({ days: 12, hours: 2 }),
            studio: null,
            deleted_at: null,
          },
          {
            id: 3,
            venue_id: 3,
            organizer_id: 3,
            title: 'Nusantara Symphony Live in Jakarta',
            type: 'concert',
            event_date: offsetDate({ days: 20, hours: 4 }),
            studio: null,
            deleted_at: null,
          },
          {
            id: 4,
            venue_id: 1,
            organizer_id: 3,
            title: 'Interstellar: 4K Anniversary Screening',
            type: 'cinema',
            event_date: offsetDate({ days: 3, hours: 5 }),
            studio: 'Studio 3 Premiere',
            deleted_at: null,
          },
          {
            id: 5,
            venue_id: 2,
            organizer_id: 2,
            title: 'Pontianak Jazz Night 2026',
            type: 'concert',
            event_date: offsetDate({ days: 25, hours: 1 }),
            studio: null,
            deleted_at: offsetDate({ days: -2 }),
          },
        ],
        tickets: [
          { id: 1, event_id: 1, label: 'A1', price: 75000, quota: 1, sold: 0, deleted_at: null },
          { id: 2, event_id: 1, label: 'A2', price: 75000, quota: 1, sold: 1, deleted_at: null },
          { id: 3, event_id: 1, label: 'B1', price: 65000, quota: 1, sold: 0, deleted_at: null },
          { id: 4, event_id: 2, label: 'VIP Front Stage', price: 350000, quota: 10, sold: 7, deleted_at: null },
          { id: 5, event_id: 2, label: 'Festival Standing', price: 150000, quota: 50, sold: 18, deleted_at: null },
          { id: 6, event_id: 3, label: 'VVIP Seating', price: 1200000, quota: 5, sold: 2, deleted_at: null },
          { id: 7, event_id: 3, label: 'Tribune Reguler', price: 450000, quota: 80, sold: 35, deleted_at: null },
          { id: 8, event_id: 4, label: 'C4', price: 85000, quota: 1, sold: 0, deleted_at: null },
          { id: 9, event_id: 4, label: 'C5', price: 85000, quota: 1, sold: 0, deleted_at: null },
          { id: 10, event_id: 5, label: 'VIP Jazz', price: 250000, quota: 20, sold: 2, deleted_at: offsetDate({ days: -2 }) },
        ],
        bookings: [
          {
            id: 1,
            user_id: 4,
            ticket_id: 4,
            booking_code: 'FTX-9K2M4P7Q1W',
            quantity: 1,
            total_price: 350000,
            status: 'pending',
            expires_at: offsetDate({ minutes: 14 }),
            paid_at: null,
            cancelled_at: null,
            idempotency_key: 'idem-seed-nova-001',
            created_at: offsetDate({ minutes: -1 }),
          },
          {
            id: 2,
            user_id: 4,
            ticket_id: 10,
            booking_code: 'FTX-4R8T2Y6U9I',
            quantity: 2,
            total_price: 500000,
            status: 'paid',
            expires_at: null,
            paid_at: offsetDate({ days: -3 }),
            cancelled_at: null,
            idempotency_key: 'idem-seed-nova-002',
            created_at: offsetDate({ days: -3 }),
          },
          {
            id: 3,
            user_id: 5,
            ticket_id: 2,
            booking_code: 'FTX-7B3N5V8C1X',
            quantity: 1,
            total_price: 75000,
            status: 'paid',
            expires_at: null,
            paid_at: offsetDate({ days: -1 }),
            cancelled_at: null,
            idempotency_key: 'idem-seed-marcello-001',
            created_at: offsetDate({ days: -1 }),
          },
          {
            id: 4,
            user_id: 5,
            ticket_id: 6,
            booking_code: 'FTX-2L6H9J4K8M',
            quantity: 2,
            total_price: 2400000,
            status: 'pending',
            expires_at: offsetDate({ minutes: 10 }),
            paid_at: null,
            cancelled_at: null,
            idempotency_key: 'idem-seed-marcello-002',
            created_at: offsetDate({ minutes: -5 }),
          },
        ],
      };
    }


    function formatRupiah(amount) {
      return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
    }

    function formatDateIndo(isoString, includeTime = true) {
      if (!isoString) return '-';
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const opts = { day: '2-digit', month: 'short', year: 'numeric' };
      if (includeTime) {
        opts.hour = '2-digit';
        opts.minute = '2-digit';
      }
      return d.toLocaleDateString('id-ID', opts) + (includeTime ? ' WIB' : '');
    }

    function toDatetimeLocalValue(isoString) {
      if (!isoString) return '';
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function generateBookingCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let out = 'FTX-';
      for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    }

    function generateIdempotencyKey() {
      const rand = Math.random().toString(36).substring(2, 10);
      return `idem-${Date.now().toString(36)}-${rand}`;
    }

    function escapeHtml(str) {
      return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }


    function statusText(code) {
      const map = {
        200: '200 OK',
        201: '201 Created',
        401: '401 Unauthorized',
        403: '403 Forbidden',
        404: '404 Not Found',
        409: '409 Conflict',
        422: '422 Unprocessable Entity',
        429: '429 Too Many Requests',
        500: '500 Server Error',
      };
      return map[code] || String(code);
    }

    class FourtixStorage {
      #db;
      #currentUser;
      #token;
      #mode;
      #ui;

      constructor() {
        this.#db = createInitialMockDb();
        this.#currentUser = this.#db.users.find((u) => u.id === 4) || null;
        this.#token = null;
        this.#mode = 'mock';
        this.#ui = {
      apiBaseUrl: 'http://127.0.0.1:8000/api',
      activeShell: 'customer',
      customerPage: 'explore',
      panelTab: 'dashboard',
      searchQuery: '',
      categoryFilter: 'all',
      cityFilter: 'all',
      showTrashedVenues: false,
      showTrashedEvents: false,
      showTrashedTickets: false,
      showOtherOrganizerEvents: false,
      showOtherOrganizerTickets: false,
      bookingDraft: { eventId: null, selectedTicketId: null, quantity: 1, idempotencyKey: '' },
      confirmCallback: null
        };
      }

  get mode() { return this.#mode; }
  set mode(value) { this.#mode = value; }

  get token() { return this.#token; }
  set token(value) { this.#token = value; }

  get db() { return this.#db; }
  set db(value) { this.#db = value; }

  get currentUser() { return this.#currentUser; }
  set currentUser(value) { this.#currentUser = value; }

  get apiBaseUrl() { return this.#ui.apiBaseUrl; }
  set apiBaseUrl(value) { this.#ui.apiBaseUrl = value; }

  get activeShell() { return this.#ui.activeShell; }
  set activeShell(value) { this.#ui.activeShell = value; }

  get customerPage() { return this.#ui.customerPage; }
  set customerPage(value) { this.#ui.customerPage = value; }

  get panelTab() { return this.#ui.panelTab; }
  set panelTab(value) { this.#ui.panelTab = value; }

  get searchQuery() { return this.#ui.searchQuery; }
  set searchQuery(value) { this.#ui.searchQuery = value; }

  get categoryFilter() { return this.#ui.categoryFilter; }
  set categoryFilter(value) { this.#ui.categoryFilter = value; }

  get cityFilter() { return this.#ui.cityFilter; }
  set cityFilter(value) { this.#ui.cityFilter = value; }

  get showTrashedVenues() { return this.#ui.showTrashedVenues; }
  set showTrashedVenues(value) { this.#ui.showTrashedVenues = value; }

  get showTrashedEvents() { return this.#ui.showTrashedEvents; }
  set showTrashedEvents(value) { this.#ui.showTrashedEvents = value; }

  get showTrashedTickets() { return this.#ui.showTrashedTickets; }
  set showTrashedTickets(value) { this.#ui.showTrashedTickets = value; }

  get showOtherOrganizerEvents() { return this.#ui.showOtherOrganizerEvents; }
  set showOtherOrganizerEvents(value) { this.#ui.showOtherOrganizerEvents = value; }

  get showOtherOrganizerTickets() { return this.#ui.showOtherOrganizerTickets; }
  set showOtherOrganizerTickets(value) { this.#ui.showOtherOrganizerTickets = value; }

  get bookingDraft() { return this.#ui.bookingDraft; }
  set bookingDraft(value) { this.#ui.bookingDraft = value; }

  get confirmCallback() { return this.#ui.confirmCallback; }
  set confirmCallback(value) { this.#ui.confirmCallback = value; }

      resetDemo() {
        this.#db = createInitialMockDb();
        this.#currentUser = this.#db.users.find((u) => u.id === 4) || null;
      }
    }

    class ReservableEvent {
      constructor(raw = {}) {
        this.id = raw.id;
        this.title = raw.title;
        this.venue_id = raw.venue_id;
        this.organizer_id = raw.organizer_id;
        this.event_date = raw.event_date;
        this.deleted_at = raw.deleted_at ?? null;
        this.raw = raw;
      }

      // Factory method: memilih subclass berdasarkan tipe event.
      static fromRaw(rawEvent) {
        return rawEvent && rawEvent.type === 'cinema'
          ? new CinemaShow(rawEvent)
          : new ConcertEvent(rawEvent);
      }

      getTypeLabel() { return 'Event'; }
      getSubDetail() { return '-'; }
      getBadgeInfo() { return { label: 'Event', dot: 'bg-ink' }; }

      renderPoster(compact = false) {
        const ratio = compact ? 'h-32' : 'aspect-[16/7]';
        return `<div class="${ratio} w-full bg-wash"></div>`;
      }
    }

    class CinemaShow extends ReservableEvent {
      constructor(raw = {}) { super(raw); this.studio = raw.studio ?? null; }
      getTypeLabel() { return 'Cinema'; }
      getSubDetail() { return this.studio || 'Studio 1'; }
      getBadgeInfo() { return { label: 'Bioskop', dot: 'bg-brass' }; }

      renderPoster(compact = false) {
        const ratio = compact ? 'h-32' : 'aspect-[16/7]';
        return `
          <div class="${ratio} w-full overflow-hidden bg-velvet-deep relative">
            <img src="${eventImage(this.id, 'cinema')}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-85 hover-zoom" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-velvet-deep via-velvet-deep/25 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 p-3">
              <p class="text-[10px] font-medium text-white/55">${escapeHtml(this.studio || 'Bioskop')}</p>
              <p class="text-sm font-bold text-white leading-tight line-clamp-2">${escapeHtml(this.title)}</p>
            </div>
          </div>
        `;
      }
    }

    class ConcertEvent extends ReservableEvent {
      constructor(raw = {}) { super(raw); this.zoneLabel = raw.zoneLabel ?? 'Zona & kuota'; }
      getTypeLabel() { return 'Concert'; }
      getSubDetail() { return this.zoneLabel; }
      getBadgeInfo() { return { label: 'Konser', dot: 'bg-ember' }; }

      renderPoster(compact = false) {
        const ratio = compact ? 'h-32' : 'aspect-[16/7]';
        return `
          <div class="${ratio} w-full overflow-hidden bg-ember-dark relative">
            <img src="${eventImage(this.id, 'concert')}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-85 hover-zoom" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-ember-dark via-ember-dark/25 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 p-3">
              <p class="text-[10px] font-medium text-white/55">${escapeHtml(formatDateIndo(this.event_date, false))}</p>
              <p class="text-sm font-bold text-white leading-tight line-clamp-2">${escapeHtml(this.title)}</p>
            </div>
          </div>
        `;
      }
    }

    class TicketModel {
      constructor(raw = {}) { this.raw = raw; }
      getRemaining() { return Math.max(0, Number(this.raw.quota) - Number(this.raw.sold)); }
      isSoldOut() { return this.getRemaining() <= 0; }
      canReduceQuotaTo(newQuota) { return Number(newQuota) >= Number(this.raw.sold); }
    }

    class BookingModel {
      constructor(raw = {}) { this.raw = raw; }
      isExpired() {
        return !!this.raw.expires_at && new Date(this.raw.expires_at).getTime() <= Date.now();
      }
      canBePaid() { return this.raw.status === 'pending'; }
      canBeCancelled() { return this.raw.status === 'pending'; }
    }

    class ApiGateway {
      #storage;
      constructor(storage) { this.#storage = storage; }
      get storage() { return this.#storage; }

    getVenue(id, withTrashed = false) {
      return this.storage.db.venues.find((v) => v.id === Number(id) && (withTrashed || !v.deleted_at)) || null;
    }

    getEvent(id, withTrashed = false) {
      return this.storage.db.events.find((e) => e.id === Number(id) && (withTrashed || !e.deleted_at)) || null;
    }

    getTicket(id, withTrashed = false) {
      return this.storage.db.tickets.find((t) => t.id === Number(id) && (withTrashed || !t.deleted_at)) || null;
    }

    getUser(id) {
      return this.storage.db.users.find((u) => u.id === Number(id)) || null;
    }

    getRemaining(ticket) {
      return new TicketModel(ticket).getRemaining();
    }

    getUserEventActiveTicketCount(userId, eventId) {
      return this.storage.db.bookings
        .filter((b) => {
          if (b.user_id !== Number(userId)) return false;
          if (!['pending', 'paid'].includes(b.status)) return false;
          const tk = getTicket(b.ticket_id, true);
          return tk && tk.event_id === Number(eventId);
        })
        .reduce((sum, b) => sum + Number(b.quantity), 0);
    }

    getLowestTicketPrice(eventId) {
      const activeTickets = this.storage.db.tickets.filter((t) => t.event_id === Number(eventId) && !t.deleted_at);
      if (!activeTickets.length) return null;
      return Math.min(...activeTickets.map((t) => Number(t.price)));
    }

    // PEMBANTU API LIVE (KONEKSI SANCTUM LARAVEL)

    async liveRequest(method, path, body = null, extraHeaders = {}) {
      const base = this.storage.apiBaseUrl.replace(/\/+$/, '');
      const url = `${base}${path}`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...extraHeaders,
      };
      if (this.storage.token) headers.Authorization = `Bearer ${this.storage.token}`;

      try {
        const res = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        let data = {};
        try {
          data = await res.json();
        } catch (_) {
          data = {};
        }
        return { ok: res.ok, status: res.status, data };
      } catch (err) {
        return {
          ok: false,
          status: 500,
          data: {
            message: `Gagal terhubung ke ${url}. Pastikan server Laravel berjalan & CORS aktif.`,
          },
        };
      }
    }

    // Menyinkronkan data dari API Live saat mode berubah

    async syncFromLiveApi() {
      if (!this.storage.token) {
        showToast({
          method: 'GET',
          endpoint: '/api/events',
          status: 401,
          message: 'Mode Live API aktif. Silakan login menggunakan akun Laravel Sanctum Anda.',
        });
        return;
      }
      const [vRes, eRes, tRes, bRes] = await Promise.all([
        liveRequest('GET', '/venues'),
        liveRequest('GET', '/events'),
        liveRequest('GET', '/tickets'),
        liveRequest('GET', '/bookings'),
      ]);
      if (vRes.ok && Array.isArray(vRes.data?.data)) this.storage.db.venues = vRes.data.data;
      if (eRes.ok && Array.isArray(eRes.data?.data)) this.storage.db.events = eRes.data.data;
      if (tRes.ok && Array.isArray(tRes.data?.data)) this.storage.db.tickets = tRes.data.data;
      if (bRes.ok && Array.isArray(bRes.data?.data)) this.storage.db.bookings = bRes.data.data;
      render();
    }

    // LAYANAN LOGIKA BISNIS (14 ATURAN FOURTIX)

    // --- AUTENTIKASI ---

    async apiLogin(email, password) {
      if (this.storage.mode === 'live') {
        const res = await liveRequest('POST', '/login', { email, password });
        if (!res.ok) return { ok: false, status: res.status, message: res.data.message || 'Email atau password salah.' };
        this.storage.token = res.data.token;
        this.storage.currentUser = res.data.user;
        await syncFromLiveApi();
        return { ok: true, status: res.status, message: `Login berhasil sebagai ${this.storage.currentUser.name} (${this.storage.currentUser.role}).` };
      }

      const user = this.storage.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) {
        return { ok: false, status: 401, message: 'Email atau password salah!' };
      }
      this.storage.currentUser = user;
      return { ok: true, status: 200, message: `Login berhasil sebagai ${user.name} (${user.role}).` };
    }

    async apiRegister(name, email, password, password_confirmation) {
      if (password !== password_confirmation) {
        return { ok: false, status: 422, message: 'Konfirmasi password tidak cocok.' };
      }
      if (this.storage.mode === 'live') {
        const res = await liveRequest('POST', '/register', { name, email, password, password_confirmation });
        if (!res.ok) return { ok: false, status: res.status, message: res.data.message || 'Registrasi gagal.' };
        this.storage.token = res.data.token;
        this.storage.currentUser = res.data.user;
        await syncFromLiveApi();
        return { ok: true, status: 201, message: `Akun ${this.storage.currentUser.name} terdaftar otomatis sebagai customer.` };
      }

      if (this.storage.db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, status: 422, message: 'Email sudah terdaftar.' };
      }
      const newUser = {
        id: this.storage.db.nextIds.users++,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'customer', // Strictly enforced
      };
      this.storage.db.users.push(newUser);
      this.storage.currentUser = newUser;
      return { ok: true, status: 201, message: `Register berhasil! Akun ${newUser.name} dibuat dengan role customer.` };
    }

    async apiLogout() {
      if (this.storage.mode === 'live' && this.storage.token) {
        await liveRequest('POST', '/logout');
        this.storage.token = null;
      }
      this.storage.currentUser = null;
      this.storage.activeShell = 'customer';
      this.storage.customerPage = 'explore';
      syncRoleSwitcherDropdown();
      showToast({ method: 'POST', endpoint: '/api/logout', status: 200, message: 'Logout berhasil. Token sesi telah dihapus.' });
      render();
    }

    // --- BOOKING (BUAT, BAYAR, BATALKAN, KEDALUWARSA) ---

    async apiCreateBooking({ ticketId, quantity, idempotencyKey }) {
      const endpoint = '/api/bookings';
      if (!this.storage.currentUser) {
        return { ok: false, status: 401, message: 'Silakan masuk terlebih dahulu untuk memesan tiket.' };
      }
      if (this.storage.currentUser.role !== 'customer') {
        return { ok: false, status: 403, message: `Role '${this.storage.currentUser.role}' tidak diizinkan membuat booking. Hanya customer yang boleh.` };
      }
      if (!idempotencyKey || !idempotencyKey.trim()) {
        return { ok: false, status: 422, message: 'Header Idempotency-Key wajib dikirim.' };
      }

      if (this.storage.mode === 'live') {
        const res = await liveRequest('POST', '/bookings', { ticket_id: Number(ticketId), quantity: Number(quantity) }, { 'Idempotency-Key': idempotencyKey.trim() });
        if (res.ok) await syncFromLiveApi();
        return { ok: res.ok, status: res.status, booking: res.data?.data, message: res.data?.message || (res.ok ? 'Booking berhasil dibuat!' : 'Gagal membuat booking.') };
      }

      const key = idempotencyKey.trim();
      const existing = this.storage.db.bookings.find((b) => b.user_id === this.storage.currentUser.id && b.idempotency_key === key);
      if (existing) {
        if (existing.ticket_id === Number(ticketId) && existing.quantity === Number(quantity)) {
          return {
            ok: true,
            status: 200,
            idempotentReplay: true,
            booking: existing,
            message: `Idempotency Hit! Request identik mengembalikan booking lama (${existing.booking_code}) tanpa memotong kuota ganda.`,
          };
        }
        return {
          ok: false,
          status: 409,
          message: `Idempotency-Key '${key}' sudah digunakan untuk payload berbeda (ticket_id/quantity tidak sama).`,
        };
      }

      const ticket = getTicket(ticketId, false);
      if (!ticket) {
        return { ok: false, status: 422, message: 'Tiket tidak ditemukan atau sudah dihapus (soft delete).' };
      }
      const ev = getEvent(ticket.event_id, false);
      if (!ev) {
        return { ok: false, status: 422, message: 'Event sudah dihapus (soft delete) dan tidak dapat dipesan.' };
      }
      if (new Date(ev.event_date).getTime() <= Date.now()) {
        return { ok: false, status: 422, message: 'Event sudah berlalu.' };
      }

      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        return { ok: false, status: 422, message: 'Jumlah tiket minimal 1.' };
      }
      const existingQty = getUserEventActiveTicketCount(this.storage.currentUser.id, ev.id);
      if (existingQty + qty > FOURTIX_CONFIG.maxTicketsPerEvent) {
        return {
          ok: false,
          status: 422,
          message: `Batas maksimal ${FOURTIX_CONFIG.maxTicketsPerEvent} tiket per event terlampaui (Anda sudah punya ${existingQty} tiket aktif untuk event ini).`,
        };
      }

      const remaining = getRemaining(ticket);
      if (qty > remaining) {
        return { ok: false, status: 409, message: `Kuota tidak mencukupi. Tersisa ${remaining} tiket untuk ${ticket.label}.` };
      }

      ticket.sold = Number(ticket.sold) + qty;
      const booking = {
        id: this.storage.db.nextIds.bookings++,
        user_id: this.storage.currentUser.id,
        ticket_id: ticket.id,
        booking_code: generateBookingCode(),
        quantity: qty,
        total_price: Number(ticket.price) * qty,
        status: 'pending',
        expires_at: offsetDate({ minutes: FOURTIX_CONFIG.paymentTtlMinutes }),
        paid_at: null,
        cancelled_at: null,
        idempotency_key: key,
        created_at: new Date().toISOString(),
      };
      this.storage.db.bookings.unshift(booking);

      return {
        ok: true,
        status: 201,
        booking,
        message: `Booking ${booking.booking_code} dibuat (status: pending). Selesaikan pembayaran dalam ${FOURTIX_CONFIG.paymentTtlMinutes} menit.`,
      };
    }


    expireBookingRecord(booking) {
      if (!new BookingModel(booking).canBePaid()) return false;
      const ticket = getTicket(booking.ticket_id, true);
      booking.status = 'expired';
      if (ticket) {
        ticket.sold = Math.max(0, Number(ticket.sold) - Number(booking.quantity));
      }
      return true;
    }

    async apiPayBooking(bookingId) {
      const endpoint = `/api/bookings/${bookingId}/pay`;
      if (!this.storage.currentUser) return { ok: false, status: 401, message: 'Unauthenticated.' };

      if (this.storage.mode === 'live') {
        const res = await liveRequest('POST', `/bookings/${bookingId}/pay`);
        if (res.ok) await syncFromLiveApi();
        showToast({ method: 'POST', endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Pembayaran berhasil!' : 'Pembayaran ditolak.') });
        render();
        return;
      }

      const booking = this.storage.db.bookings.find((b) => b.id === Number(bookingId));
      if (!booking) {
        showToast({ method: 'POST', endpoint, status: 404, message: 'Booking tidak ditemukan.' });
        return;
      }
      if (this.storage.currentUser.role !== 'customer' || booking.user_id !== this.storage.currentUser.id) {
        showToast({ method: 'POST', endpoint, status: 403, message: 'Akses ditolak. Bukan booking milik Anda.' });
        return;
      }
      if (!new BookingModel(booking).canBeCancelled()) {
        showToast({ method: 'POST', endpoint, status: 409, message: `Booking berstatus '${booking.status}' tidak dapat dibayar.` });
        return;
      }
      if (new BookingModel(booking).isExpired()) {
        expireBookingRecord(booking);
        showToast({
          method: 'POST',
          endpoint,
          status: 409,
          message: `Batas pembayaran terlewati! Booking ${booking.booking_code} otomatis diubah menjadi expired dan kuota dikembalikan.`,
        });
        render();
        return;
      }

      booking.status = 'paid';
      booking.paid_at = new Date().toISOString();
      showToast({ method: 'POST', endpoint, status: 200, message: `Pembayaran berhasil! E-Ticket ${booking.booking_code} kini berstatus PAID.` });
      render();
    }

    async apiCancelBooking(bookingId) {
      const endpoint = `/api/bookings/${bookingId}/cancel`;
      if (!this.storage.currentUser) return;

      if (this.storage.mode === 'live') {
        const res = await liveRequest('POST', `/bookings/${bookingId}/cancel`);
        if (res.ok) await syncFromLiveApi();
        showToast({ method: 'POST', endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Booking dibatalkan.' : 'Pembatalan ditolak.') });
        render();
        return;
      }

      const booking = this.storage.db.bookings.find((b) => b.id === Number(bookingId));
      if (!booking) {
        showToast({ method: 'POST', endpoint, status: 404, message: 'Booking tidak ditemukan.' });
        return;
      }
      if (this.storage.currentUser.role !== 'customer' || booking.user_id !== this.storage.currentUser.id) {
        showToast({ method: 'POST', endpoint, status: 403, message: 'Akses ditolak. Hanya pemilik booking yang bisa membatalkan.' });
        return;
      }
      if (booking.status === 'paid') {
        showToast({ method: 'POST', endpoint, status: 409, message: 'Kebijakan FOURTIX: Booking berstatus PAID tidak dapat dibatalkan.' });
        return;
      }
      if (!new BookingModel(booking).canBeCancelled()) {
        showToast({ method: 'POST', endpoint, status: 409, message: `Booking berstatus '${booking.status}' tidak dapat dibatalkan.` });
        return;
      }
      if (new BookingModel(booking).isExpired()) {
        expireBookingRecord(booking);
        showToast({
          method: 'POST',
          endpoint,
          status: 409,
          message: `Waktu pembayaran sudah habis! Booking ${booking.booking_code} diubah ke expired dan kuota dikembalikan.`,
        });
        render();
        return;
      }

      const ticket = getTicket(booking.ticket_id, true);
      booking.status = 'cancelled';
      booking.cancelled_at = new Date().toISOString();
      if (ticket) {
        ticket.sold = Math.max(0, Number(ticket.sold) - Number(booking.quantity));
      }
      showToast({ method: 'POST', endpoint, status: 200, message: `Booking ${booking.booking_code} dibatalkan dan kuota dikembalikan.` });
      render();
    }


    simulateBookingTimeout(bookingId) {
      if (this.storage.mode === 'live') {
        showToast({ method: 'CRON', endpoint: 'simulasi/expires_at', status: 405, message: 'Simulasi waktu habis hanya tersedia di Mock Data. Jalankan scheduler di backend untuk Live API.' });
        return;
      }
      const booking = this.storage.db.bookings.find((b) => b.id === Number(bookingId));
      if (!booking || !new BookingModel(booking).canBePaid()) return;
      booking.expires_at = offsetDate({ minutes: -1 });
      showToast({
        method: 'CRON',
        endpoint: 'simulasi/expires_at',
        status: 200,
        message: `Waktu bayar ${booking.booking_code} diset melewati batas! Coba klik "Bayar sekarang" untuk melihat 409 + auto-expire.`,
      });
      render();
    }


    runExpireSchedulerJob() {
      if (this.storage.mode === 'live') {
        showToast({ method: 'CRON', endpoint: 'artisan schedule:run', status: 405, message: 'Job expire dijalankan oleh scheduler Laravel di backend, bukan dari browser.' });
        return;
      }
      let expiredCount = 0;
      const now = Date.now();
      this.storage.db.bookings.forEach((b) => {
        if (b.status === 'pending' && b.expires_at && new Date(b.expires_at).getTime() < now) {
          if (expireBookingRecord(b)) expiredCount++;
        }
      });
      showToast({
        method: 'CRON',
        endpoint: 'artisan schedule:run',
        status: 200,
        message: expiredCount > 0
          ? `Scheduler Expire selesai: ${expiredCount} booking kedaluwarsa diubah ke expired & kuota dikembalikan.`
          : 'Scheduler Expire berjalan: tidak ada booking pending yang melewati expires_at.',
      });
      render();
    }

    // --- CRUD VENUE (ADMIN PENUH, ORGANIZER HANYA BACA) ---

    async apiSaveVenue(id, payload) {
      if (!this.storage.currentUser || this.storage.currentUser.role !== 'admin') {
        showToast({ method: id ? 'PATCH' : 'POST', endpoint: id ? `/api/venues/${id}` : '/api/venues', status: 403, message: 'VenuePolicy: Hanya Admin yang dapat mengelola venue.' });
        return false;
      }
      const method = id ? 'PATCH' : 'POST';
      const endpoint = id ? `/api/venues/${id}` : '/api/venues';

      if (this.storage.mode === 'live') {
        const res = await liveRequest(method, id ? `/venues/${id}` : '/venues', payload);
        if (res.ok) await syncFromLiveApi();
        showToast({ method, endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Venue disimpan.' : 'Gagal menyimpan venue.') });
        return res.ok;
      }

      if (id) {
        const v = getVenue(id, true);
        if (!v) return false;
        Object.assign(v, payload);
        showToast({ method: 'PATCH', endpoint, status: 200, message: `Venue "${v.name}" berhasil diperbarui secara parsial.` });
      } else {
        const newVenue = { id: this.storage.db.nextIds.venues++, ...payload, deleted_at: null };
        this.storage.db.venues.unshift(newVenue);
        showToast({ method: 'POST', endpoint, status: 201, message: `Venue "${newVenue.name}" berhasil ditambahkan.` });
      }
      return true;
    }

    async apiDeleteVenue(id) {
      const endpoint = `/api/venues/${id}`;
      if (!this.storage.currentUser || this.storage.currentUser.role !== 'admin') {
        showToast({ method: 'DELETE', endpoint, status: 403, message: 'VenuePolicy: Hanya Admin yang dapat menghapus venue.' });
        return;
      }
      if (this.storage.mode === 'live') {
        const res = await liveRequest('DELETE', `/venues/${id}`);
        if (res.ok) await syncFromLiveApi();
        showToast({ method: 'DELETE', endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Venue di-soft-delete.' : 'Gagal menghapus venue.') });
        render();
        return;
      }

      const v = getVenue(id, false);
      if (!v) return;
      const hasActiveEvents = this.storage.db.events.some((e) => e.venue_id === v.id && !e.deleted_at);
      if (hasActiveEvents) {
        showToast({
          method: 'DELETE',
          endpoint,
          status: 422,
          message: `Venue "${v.name}" tidak boleh di-soft-delete karena masih memiliki event aktif!`,
        });
        return;
      }
      v.deleted_at = new Date().toISOString();
      showToast({ method: 'DELETE', endpoint, status: 200, message: `Venue "${v.name}" berhasil di-soft-delete (deleted_at terisi).` });
      render();
    }

    async apiRestoreVenue(id) {
      const endpoint = `/api/venues/${id}/restore`;
      if (!this.storage.currentUser || this.storage.currentUser.role !== 'admin') {
        showToast({ method: 'PATCH', endpoint, status: 403, message: 'Hanya Admin yang dapat memulihkan venue.' });
        return;
      }
      if (this.storage.mode === 'live') {
        showToast({ method: 'PATCH', endpoint, status: 405, message: 'Backend belum menyediakan endpoint restore venue.' });
        return;
      }
      const v = getVenue(id, true);
      if (!v) return;
      v.deleted_at = null;
      showToast({ method: 'PATCH', endpoint, status: 200, message: `Venue "${v.name}" berhasil dipulihkan (restored).` });
      render();
    }

    // --- CRUD EVENT (ADMIN SEMUA, ORGANIZER EVENT SENDIRI) ---

    canManageEvent(ev) {
      if (!this.storage.currentUser) return false;
      if (this.storage.currentUser.role === 'admin') return true;
      if (this.storage.currentUser.role === 'organizer') return ev.organizer_id === this.storage.currentUser.id;
      return false;
    }

    async apiSaveEvent(id, payload) {
      const method = id ? 'PATCH' : 'POST';
      const endpoint = id ? `/api/events/${id}` : '/api/events';

      if (!this.storage.currentUser || !['admin', 'organizer'].includes(this.storage.currentUser.role)) {
        showToast({ method, endpoint, status: 403, message: 'Akses ditolak.' });
        return false;
      }

      const venue = getVenue(payload.venue_id, false);
      if (!venue) {
        showToast({ method, endpoint, status: 422, message: 'Venue tidak ditemukan atau sudah di-soft-delete.' });
        return false;
      }

      const cleanPayload = {
        venue_id: Number(payload.venue_id),
        title: payload.title.trim(),
        type: payload.type,
        event_date: new Date(payload.event_date).toISOString(),
        studio: payload.type === 'cinema' ? (payload.studio || '').trim() || 'Studio 1' : null,
      };

      if (this.storage.mode === 'live') {
        const res = await liveRequest(method, id ? `/events/${id}` : '/events', cleanPayload);
        if (res.ok) await syncFromLiveApi();
        showToast({ method, endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Event disimpan.' : 'Gagal menyimpan event.') });
        return res.ok;
      }

      if (id) {
        const ev = getEvent(id, true);
        if (!ev) return false;
        if (!canManageEvent(ev)) {
          showToast({ method: 'PATCH', endpoint, status: 403, message: 'EventPolicy: Organizer tidak boleh mengubah event milik organizer lain!' });
          return false;
        }
        Object.assign(ev, cleanPayload);
        showToast({ method: 'PATCH', endpoint, status: 200, message: `Event "${ev.title}" berhasil diperbarui.` });
      } else {
        const newEv = {
          id: this.storage.db.nextIds.events++,
          ...cleanPayload,
          organizer_id: this.storage.currentUser.role === 'organizer' ? this.storage.currentUser.id : Number(payload.organizer_id || this.storage.currentUser.id),
          deleted_at: null,
        };
        this.storage.db.events.unshift(newEv);
        showToast({ method: 'POST', endpoint, status: 201, message: `Event ${newEv.type === 'cinema' ? 'CinemaShow' : 'ConcertEvent'} "${newEv.title}" berhasil dibuat.` });
      }
      return true;
    }

    async apiDeleteEvent(id) {
      const endpoint = `/api/events/${id}`;
      const ev = getEvent(id, false);
      if (!ev) return;

      if (!canManageEvent(ev)) {
        showToast({ method: 'DELETE', endpoint, status: 403, message: 'EventPolicy: Organizer tidak boleh menghapus event milik organizer lain!' });
        return;
      }

      if (this.storage.mode === 'live') {
        const res = await liveRequest('DELETE', `/events/${id}`);
        if (res.ok) await syncFromLiveApi();
        showToast({ method: 'DELETE', endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Event di-soft-delete.' : 'Gagal menghapus event.') });
        render();
        return;
      }

      const eventTicketIds = this.storage.db.tickets.filter((t) => t.event_id === ev.id).map((t) => t.id);
      const hasPending = this.storage.db.bookings.some((b) => eventTicketIds.includes(b.ticket_id) && b.status === 'pending');
      if (hasPending) {
        showToast({
          method: 'DELETE',
          endpoint,
          status: 409,
          message: `Event "${ev.title}" ditolak dihapus karena masih ada booking berstatus PENDING!`,
        });
        return;
      }

      const nowIso = new Date().toISOString();
      ev.deleted_at = nowIso;
      let cascaded = 0;
      this.storage.db.tickets.forEach((t) => {
        if (t.event_id === ev.id && !t.deleted_at) {
          t.deleted_at = nowIso;
          cascaded++;
        }
      });
      showToast({
        method: 'DELETE',
        endpoint,
        status: 200,
        message: `Event "${ev.title}" & ${cascaded} tiket terkait berhasil di-soft-delete. Riwayat booking tetap terjaga.`,
      });
      render();
    }

    async apiRestoreEvent(id) {
      const endpoint = `/api/events/${id}/restore`;

      if (this.storage.mode === 'live') {
        const res = await liveRequest('PATCH', `/events/${id}/restore`);
        if (res.ok) await syncFromLiveApi();
        showToast({ method: 'PATCH', endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Event dipulihkan.' : 'Gagal memulihkan event.') });
        return;
      }

      const ev = getEvent(id, true);
      if (!ev) return;
      if (!canManageEvent(ev)) {
        showToast({ method: 'PATCH', endpoint, status: 403, message: 'EventPolicy: Akses ditolak.' });
        return;
      }

      ev.deleted_at = null;
      let restoredTickets = 0;
      this.storage.db.tickets.forEach((t) => {
        if (t.event_id === ev.id && t.deleted_at) {
          t.deleted_at = null;
          restoredTickets++;
        }
      });
      showToast({
        method: 'PATCH',
        endpoint,
        status: 200,
        message: `Event "${ev.title}" & ${restoredTickets} tiket terkait berhasil dipulihkan.`,
      });
      render();
    }

    // --- CRUD TIKET (KEPEMILIKAN + BATASAN sold <= quota) ---

    canManageTicket(ticket) {
      const ev = getEvent(ticket.event_id, true);
      return ev ? canManageEvent(ev) : false;
    }

    async apiSaveTicket(id, payload) {
      const method = id ? 'PATCH' : 'POST';
      const endpoint = id ? `/api/tickets/${id}` : '/api/tickets';

      const ev = getEvent(payload.event_id, false);
      if (!ev) {
        showToast({ method, endpoint, status: 422, message: 'Event tidak ditemukan atau sudah di-soft-delete.' });
        return false;
      }
      if (!canManageEvent(ev)) {
        showToast({ method, endpoint, status: 403, message: 'TicketPolicy: Organizer tidak boleh mengelola tiket event milik organizer lain!' });
        return false;
      }

      const price = Number(payload.price);
      const quota = Number(payload.quota);
      if (isNaN(price) || price < 0) {
        showToast({ method, endpoint, status: 422, message: 'Harga tiket tidak boleh bernilai negatif.' });
        return false;
      }
      if (!Number.isInteger(quota) || quota < 0) {
        showToast({ method, endpoint, status: 422, message: 'Constraint DB: quota harus bilangan bulat >= 0.' });
        return false;
      }

      if (this.storage.mode === 'live') {
        const res = await liveRequest(method, id ? `/tickets/${id}` : '/tickets', {
          event_id: Number(payload.event_id),
          label: payload.label.trim(),
          price,
          quota,
        });
        if (res.ok) await syncFromLiveApi();
        showToast({ method, endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Tiket disimpan.' : 'Gagal menyimpan tiket.') });
        return res.ok;
      }

      if (id) {
        const tk = getTicket(id, true);
        if (!tk) return false;
        if (!canManageTicket(tk)) {
          showToast({ method: 'PATCH', endpoint, status: 403, message: 'TicketPolicy: Tidak boleh mengubah tiket milik organizer lain!' });
          return false;
        }
        if (!new TicketModel(tk).canReduceQuotaTo(quota)) {
          showToast({
            method: 'PATCH',
            endpoint,
            status: 422,
            message: `Constraint Violation (sold <= quota): Quota baru (${quota}) tidak boleh lebih kecil dari jumlah terjual saat ini (sold = ${tk.sold})!`,
          });
          return false;
        }
        tk.label = payload.label.trim();
        tk.price = price;
        tk.quota = quota;
        showToast({ method: 'PATCH', endpoint, status: 200, message: `Tiket "${tk.label}" diperbarui (quota: ${tk.quota}, sold: ${tk.sold}).` });
      } else {
        const newTk = {
          id: this.storage.db.nextIds.tickets++,
          event_id: Number(payload.event_id),
          label: payload.label.trim(),
          price,
          quota,
          sold: 0,
          deleted_at: null,
        };
        this.storage.db.tickets.unshift(newTk);
        showToast({ method: 'POST', endpoint, status: 201, message: `Tiket "${newTk.label}" berhasil ditambahkan ke "${ev.title}".` });
      }
      return true;
    }

    async apiDeleteTicket(id) {
      const endpoint = `/api/tickets/${id}`;
      const tk = getTicket(id, false);
      if (!tk) return;
      if (!canManageTicket(tk)) {
        showToast({ method: 'DELETE', endpoint, status: 403, message: 'TicketPolicy: Tidak boleh menghapus tiket milik organizer lain!' });
        return;
      }
      if (this.storage.mode === 'live') {
        const res = await liveRequest('DELETE', `/tickets/${id}`);
        if (res.ok) await syncFromLiveApi();
        showToast({ method: 'DELETE', endpoint, status: res.status, message: res.data?.message || (res.ok ? 'Tiket di-soft-delete.' : 'Gagal menghapus tiket.') });
        render();
        return;
      }

      tk.deleted_at = new Date().toISOString();
      showToast({
        method: 'DELETE',
        endpoint,
        status: 200,
        message: `Tiket "${tk.label}" di-soft-delete. Riwayat booking customer tetap dipertahankan (withTrashed).`,
      });
      render();
    }

    async apiRestoreTicket(id) {
      const endpoint = `/api/tickets/${id}/restore`;
      const tk = getTicket(id, true);
      if (!tk) return;
      if (!canManageTicket(tk)) {
        showToast({ method: 'PATCH', endpoint, status: 403, message: 'TicketPolicy: Akses ditolak.' });
        return;
      }
      if (this.storage.mode === 'live') {
        showToast({ method: 'PATCH', endpoint, status: 405, message: 'Backend belum menyediakan endpoint restore tiket.' });
        return;
      }
      tk.deleted_at = null;
      showToast({ method: 'PATCH', endpoint, status: 200, message: `Tiket "${tk.label}" berhasil dipulihkan.` });
      render();
    }

    // POSTER EVENT (MENGGUNAKAN GAMBAR PLACEHOLDER)
    }

    class FourtixAppController {
      #storage;
      #api;

      constructor(storage, api) {
        this.#storage = storage;
        this.#api = api;
      }

      get storage() { return this.#storage; }
      get api() { return this.#api; }


    // Kontrol demo tersedia untuk presenter. Customer di API Live
    // hanya melihat alur pemesanan. Gunakan tombol Dev atau ?dev=1.
    hasDevAccess() {
      return sessionStorage.getItem('fourtix-dev') === '1';
    }

    toggleDevMode() {
      const aktif = !this.hasDevAccess();
      if (aktif) sessionStorage.setItem('fourtix-dev', '1');
      else sessionStorage.removeItem('fourtix-dev');
      this.syncDevControls();
      this.render();
    }

    isCustomerFacing() {
      const user = this.storage.currentUser;
      return this.storage.mode === 'live'
        && !this.hasDevAccess()
        && (!user || user.role === 'customer');
    }

    syncDevControls() {
      const bar = document.getElementById('utility-bar');
      if (bar) bar.classList.toggle('hidden', this.isCustomerFacing());
      const quickFill = document.getElementById('auth-demo-accounts');
      if (quickFill) {
        quickFill.classList.toggle('hidden', this.storage.mode === 'live' && !this.hasDevAccess());
      }
      const tombol = document.getElementById('dev-mode-toggle');
      if (tombol) {
        tombol.textContent = this.hasDevAccess() ? 'Dev: Aktif' : 'Dev: Mati';
        tombol.classList.toggle('border-brass', this.hasDevAccess());
        tombol.classList.toggle('text-brass-dark', this.hasDevAccess());
      }
    }

    // Menghubungkan kontrol statis dari index.html
    wireGlobalControls() {
      if (new URLSearchParams(window.location.search).has('dev')) {
        sessionStorage.setItem('fourtix-dev', '1');
      }
      this.syncDevControls();
      document.getElementById('confirm-ok-btn').addEventListener('click', () => {
        const cb = this.storage.confirmCallback;
        closeConfirmModal();
        if (typeof cb === 'function') cb();
      });

      document.getElementById('role-switcher').addEventListener('change', (e) => {
        if (this.storage.mode === 'live') {
          syncRoleSwitcherDropdown();
          showToast({ method: 'INFO', endpoint: 'rbac/switch', status: 405, message: 'Role di mode Live ditentukan oleh akun backend. Keluar lalu masuk sebagai akun lain.' });
          return;
        }
        const val = e.target.value;
        const emailMap = {
          customer: 'nova@test.com',
          organizer_a: 'nabila@fourtix.id',
          organizer_b: 'novi@fourtix.id',
          admin: 'admin@fourtix.id',
        };
        if (val === 'guest') {
          this.storage.currentUser = null;
          this.storage.activeShell = 'customer';
          this.storage.customerPage = 'explore';
          showToast({ method: 'INFO', endpoint: 'rbac/switch', status: 200, message: 'Beralih ke mode Tamu.' });
        } else {
          this.storage.currentUser = this.storage.db.users.find((u) => u.email === emailMap[val]) || this.storage.db.users[3];
          this.storage.activeShell = this.storage.currentUser.role === 'customer' ? 'customer' : 'panel';
          this.storage.panelTab = 'dashboard';
          showToast({
            method: 'INFO',
            endpoint: 'rbac/switch',
            status: 200,
            message: `Beralih ke ${this.storage.currentUser.name} (Role: ${this.storage.currentUser.role.toUpperCase()}).`,
          });
        }
        render();
      });

      document.getElementById('btn-reset-demo').addEventListener('click', () => {
        this.storage.db = createInitialMockDb();
        this.storage.currentUser = this.storage.db.users.find((u) => u.id === 4);
        this.storage.mode = 'mock';
        this.storage.token = null;
        this.storage.activeShell = 'customer';
        this.storage.customerPage = 'explore';
        this.storage.searchQuery = '';
        this.storage.categoryFilter = 'all';
        this.storage.cityFilter = 'all';
        setApiMode('mock');
        syncRoleSwitcherDropdown();
        showToast({ method: 'POST', endpoint: 'mock/reset', status: 200, message: 'Data demo dikembalikan ke kondisi awal.' });
        render();
      });

      document.getElementById('mode-mock-btn').addEventListener('click', () => setApiMode('mock'));
      document.getElementById('mode-live-btn').addEventListener('click', () => setApiMode('live'));
      document.getElementById('api-base-url').addEventListener('input', (e) => {
        this.storage.apiBaseUrl = e.target.value.trim();
      });
    }


    showToast({ method = 'INFO', endpoint = '', status = 200, message = '' }) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.className = 'border border-line bg-white rounded-md px-3.5 py-3 text-sm shadow-soft';
      const technical = this.isCustomerFacing()
        ? ''
        : `<div class="flex items-center justify-between gap-3 text-xs text-muted">
             <span class="font-mono truncate">${escapeHtml(method)} · ${escapeHtml(endpoint)}</span>
             <span class="tabular shrink-0">${escapeHtml(statusText(status))}</span>
           </div>`;
      toast.innerHTML = `${technical}<p class="text-ink ${technical ? 'mt-1.5' : ''}">${escapeHtml(message)}</p>`;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 4600);
    }

    // MODAL KONFIRMASI KUSTOM (PENGGANTI confirm())

    openConfirmModal({ title, message, confirmLabel = 'Ya, Hapus', tone = 'danger', onConfirm }) {
      const modal = document.getElementById('confirm-modal');
      const titleEl = document.getElementById('confirm-title');
      const msgEl = document.getElementById('confirm-message');
      const okBtn = document.getElementById('confirm-ok-btn');
      const iconWrap = document.getElementById('confirm-icon-wrap');

      titleEl.textContent = title;
      msgEl.textContent = message;
      okBtn.textContent = confirmLabel;

      if (tone === 'primary') {
        okBtn.className = 'px-4 py-2 rounded-xl bg-ember hover:bg-ember-dark text-white text-sm font-semibold shadow-sm transition cursor-pointer';
        iconWrap.className = 'w-11 h-11 rounded-xl bg-brass-wash text-brass-dark flex items-center justify-center shrink-0';
      } else {
        okBtn.className = 'px-4 py-2 rounded-xl bg-error hover:bg-error text-white text-sm font-semibold shadow-sm transition cursor-pointer';
        iconWrap.className = 'w-11 h-11 rounded-xl bg-error-soft text-error flex items-center justify-center shrink-0';
      }

      this.storage.confirmCallback = onConfirm;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    closeConfirmModal() {
      const modal = document.getElementById('confirm-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      this.storage.confirmCallback = null;
    }


    // PEMBANTU RELASIONAL (TERMASUK DATA TERHAPUS)

    renderEventPoster(ev, compact = false) {
      return ReservableEvent.fromRaw(ev).renderPoster(compact);
    }

    renderCustomerShell() {
      const user = this.storage.currentUser;
      const isManagementRole = user && (user.role === 'admin' || user.role === 'organizer');

      return `
        <header class="bg-white border-b border-line">
          <div class="max-w-6xl mx-auto px-4 h-16 flex items-center gap-5">
            <button type="button" onclick="navigateCustomer('explore')" class="flex items-center gap-2.5 shrink-0 cursor-pointer">
              <img src="assets/fortikmantap2.png" alt="Fourtix" class="h-9 w-auto">
            </button>

            <div class="flex-1 max-w-2xl">
              <div class="relative">
                <input
                  id="customer-search-input"
                  type="text"
                  value="${escapeHtml(this.storage.searchQuery)}"
                  oninput="handleSearchInput(this.value)"
                  placeholder="Cari event, konser, atau venue"
                  class="w-full rounded-lg bg-wash px-4 py-2.5 pr-10 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brass"
                />
                <svg class="w-4 h-4 text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </div>
            </div>

            <nav class="flex items-center gap-4 text-sm shrink-0" aria-label="Navigasi utama">
              <button type="button" onclick="navigateCustomer('explore')" class="link-hover ${this.storage.customerPage === 'explore' ? 'font-semibold text-ink' : 'text-muted'}">Jelajah</button>
              <button type="button" onclick="navigateCustomer('my-bookings')" class="link-hover ${this.storage.customerPage === 'my-bookings' ? 'font-semibold text-ink' : 'text-muted'}">Tiket saya</button>
              ${isManagementRole ? `<button type="button" onclick="switchShell('panel')" class="link-hover text-muted">Panel</button>` : ''}
              ${
                user
                  ? `<button type="button" onclick="apiLogout()" class="link-hover text-muted">Keluar</button>`
                  : `<button type="button" onclick="openAuthModal('login')" class="link-hover text-link font-semibold">Masuk</button>`
              }
            </nav>
          </div>
        </header>

        <main class="flex-1">
          ${this.storage.customerPage === 'explore' ? renderCustomerExplore() : renderCustomerBookings()}
        </main>

        <footer class="border-t border-line mt-10">
          <div class="max-w-6xl mx-auto px-4 py-5 text-xs text-muted text-center">
            © Fourtix
          </div>
        </footer>
      `;
    }

    renderCustomerExplore() {
      const activeEvents = this.storage.db.events.filter((ev) => !ev.deleted_at && getVenue(ev.venue_id, false));
      const activeCities = [...new Set(activeEvents.map((ev) => getVenue(ev.venue_id, false).city))].sort();
      const featured = activeEvents[0] || null;

      const q = this.storage.searchQuery.trim().toLowerCase();
      const filtered = activeEvents.filter((ev) => {
        const venue = getVenue(ev.venue_id, false);
        if (this.storage.categoryFilter !== 'all' && ev.type !== this.storage.categoryFilter) return false;
        if (this.storage.cityFilter !== 'all' && venue.city !== this.storage.cityFilter) return false;
        if (q) {
          const hay = `${ev.title} ${venue.name} ${venue.city} ${ev.studio || ''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      return `
        ${
          featured
            ? `<section class="w-full">
                <div class="relative h-56 sm:h-64 overflow-hidden bg-ink">
                  <img src="${eventImage(featured.id, featured.type)}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-75">
                  <div class="absolute inset-0 bg-gradient-to-r from-night/95 via-night/70 to-night/20"></div>
                  <div class="absolute inset-0 flex items-end p-6 sm:p-8">
                    <div class="max-w-6xl mx-auto w-full border-l-2 border-brass pl-4">
                      <img src="assets/fortikmantap.png" alt="Fourtix" class="h-5 w-auto mix-blend-screen">
                      <h1 class="text-2xl sm:text-4xl font-bold text-white mt-1 leading-tight">${escapeHtml(featured.title)}</h1>
                      <p class="text-sm text-white/65 mt-1.5">${escapeHtml(formatDateIndo(featured.event_date))} · ${escapeHtml(getVenue(featured.venue_id, false).name)}</p>
                      <button type="button" onclick="openBookingModal(${featured.id})" class="mt-4 rounded-md bg-ember px-4 py-2 text-sm font-semibold text-white hover:bg-ember-dark">Beli tiketnya di sini</button>
                    </div>
                  </div>
                </div>
              </section>`
            : ''
        }

        <section class="max-w-6xl mx-auto px-4 py-7">
          <div class="flex items-center gap-2 mb-1">
            <svg class="w-5 h-5 text-ink" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17v5l2-2.5V17M5 17v5l2-2.5V17M5 17H3v-2a9 9 0 0118 0v2h-2M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <div>
              <h2 class="text-xl font-bold text-ink">Event Seru Untukmu</h2>
              <span class="block h-0.5 w-9 bg-brass mt-2"></span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-5 mt-4 mb-6 text-sm border-b border-line pb-3">
            ${[
              { key: 'all', label: 'Semua event' },
              { key: 'cinema', label: 'Bioskop' },
              { key: 'concert', label: 'Konser' },
            ]
              .map(
                (c) => `<button type="button" onclick="setCategoryFilter('${c.key}')" class="link-hover pb-1 ${
                  this.storage.categoryFilter === c.key ? 'font-semibold text-ink border-b-2 border-ember' : 'text-muted'
                }">${c.label}</button>`
              )
              .join('')}
            <div class="ml-auto flex items-center gap-2 text-muted">
              <label for="city-filter">Kota</label>
              <select id="city-filter" onchange="setCityFilter(this.value)" class="bg-transparent text-ink text-sm focus:outline-none cursor-pointer">
                <option value="all" ${this.storage.cityFilter === 'all' ? 'selected' : ''}>Semua kota</option>
                ${activeCities
                  .map(
                    (city) => `<option value="${escapeHtml(city)}" ${this.storage.cityFilter === city ? 'selected' : ''}>${escapeHtml(city)}</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>

          ${
            filtered.length === 0
              ? `<p class="text-sm text-muted py-16 text-center">Tidak ada event yang cocok dengan pencarian ini.</p>`
              : `<div class="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
                  ${filtered
                    .map((ev) => {
                      const venue = getVenue(ev.venue_id, false);
                      const organizer = getUser(ev.organizer_id);
                      const minPrice = getLowestTicketPrice(ev.id);
                      const badge = ReservableEvent.fromRaw(ev).getBadgeInfo();

                      return `
                        <article onclick="openBookingModal(${ev.id})" class="min-w-0 cursor-pointer group pb-4 border-b border-line">
                          <span class="block h-0.5 w-10 ${badge.dot} mb-2"></span>
                          ${renderEventPoster(ev)}
                          <p class="text-sm text-muted mt-3 truncate">${escapeHtml(venue.city)}</p>
                          <h3 class="text-base font-semibold text-ink leading-snug line-clamp-2 mt-0.5">${escapeHtml(ev.title)}</h3>
                          <p class="text-sm text-muted mt-1 truncate">Oleh ${organizer ? escapeHtml(organizer.name) : '-'}</p>
                          <div class="border-t border-dashed border-line mt-3 pt-3">
                            <p class="text-xs text-muted">Mulai dari</p>
                            <p class="tabular font-bold text-ink mt-0.5">${minPrice !== null ? formatRupiah(minPrice) : 'Belum ada tiket'}</p>
                          </div>
                        </article>
                      `;
                    })
                    .join('')}
                </div>`
          }
        </section>
      `;
    }

    renderCustomerBookings() {
      const user = this.storage.currentUser;
      if (!user) {
        return `
          <section class="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 class="text-xl font-bold text-ink">Masuk untuk melihat tiket saya</h1>
            <p class="text-sm text-muted mt-2">Riwayat pemesanan hanya untuk pemilik akun.</p>
            <button type="button" onclick="openAuthModal('login')" class="mt-5 rounded-md bg-ember px-4 py-2 text-sm font-semibold text-white hover:bg-ember-dark">Masuk sekarang</button>
          </section>
        `;
      }

      if (user.role !== 'customer') {
        return `
          <section class="max-w-2xl mx-auto px-4 py-12">
            <h1 class="text-xl font-bold text-ink">Anda masuk sebagai ${escapeHtml(user.role)}</h1>
            <p class="text-sm text-muted mt-2">Halaman tiket hanya untuk customer. Buka panel untuk memantau booking.</p>
            <button type="button" onclick="switchShell('panel')" class="mt-5 rounded-md bg-ember px-4 py-2 text-sm font-semibold text-white hover:bg-ember-dark">Buka panel</button>
          </section>
        `;
      }

      const myBookings = this.storage.db.bookings.filter((b) => b.user_id === user.id);

      return `
        <section class="max-w-4xl mx-auto px-4 py-8">
          <div class="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <h1 class="text-2xl font-bold text-ink">Tiket saya</h1>
              <p class="text-sm text-muted mt-1">Booking milik ${escapeHtml(user.name)}, termasuk event yang sudah diarsipkan.</p>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <button type="button" onclick="runExpireSchedulerJob()" class="link-hover text-muted ${this.isCustomerFacing() ? 'hidden' : ''}">Jalankan job expire</button>
              <button type="button" onclick="navigateCustomer('explore')" class="link-hover text-link">Cari event lain</button>
            </div>
          </div>

          ${
            myBookings.length === 0
              ? `<p class="text-sm text-muted py-16 text-center">Belum ada tiket.</p>`
              : `<div class="space-y-5">${myBookings.map((b) => renderCustomerBookingCard(b)).join('')}</div>`
          }
        </section>
      `;
    }

    renderCustomerBookingCard(b) {
      const ticket = getTicket(b.ticket_id, true);
      const ev = ticket ? getEvent(ticket.event_id, true) : null;
      const venue = ev ? getVenue(ev.venue_id, true) : null;
      const isArchived = Boolean((ticket && ticket.deleted_at) || (ev && ev.deleted_at));

      const statusTextMap = {
        pending: 'Menunggu pembayaran',
        paid: 'Lunas',
        cancelled: 'Dibatalkan',
        expired: 'Kedaluwarsa',
      };
      const statusLabel = statusTextMap[b.status] || b.status;

      return `
        <div class="border border-line rounded-md p-5">
          <div class="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span class="font-mono">${escapeHtml(b.booking_code)}</span>
            <span>·</span>
            <span>${statusLabel}</span>
            ${isArchived ? `<span>· Arsip</span>` : ''}
          </div>

          <h2 class="text-lg font-bold text-ink mt-2">${ev ? escapeHtml(ev.title) : 'Event tidak diketahui'}</h2>
          <p class="text-sm text-muted mt-1">
            ${ticket ? escapeHtml(ticket.label) : '-'} × <span class="tabular">${b.quantity}</span>
            ${ev && ev.studio ? ` · ${escapeHtml(ev.studio)}` : ''}
            ${venue ? ` · ${escapeHtml(venue.name)}, ${escapeHtml(venue.city)}` : ''}
          </p>
          <p class="text-xs text-muted mt-1 font-mono ${this.isCustomerFacing() ? 'hidden' : ''}">Idempotency-Key: ${escapeHtml(b.idempotency_key || '-')}</p>

          <div class="border-t border-dashed border-line mt-4 pt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs text-muted">Total pembayaran</p>
              <p class="tabular text-lg font-bold text-ink">${formatRupiah(b.total_price)}</p>
              ${
                b.status === 'pending' && b.expires_at
                  ? `<p class="tabular text-xs text-muted mt-1" data-countdown-id="${b.id}" data-expires-at="${escapeHtml(b.expires_at)}">Menghitung sisa waktu...</p>`
                  : b.status === 'paid' && b.paid_at
                  ? `<p class="tabular text-xs text-muted mt-1">Dibayar ${escapeHtml(formatDateIndo(b.paid_at))}</p>`
                  : ''
              }
            </div>
            <div class="flex flex-wrap items-center gap-3 text-sm">
              ${
                b.status === 'pending'
                  ? `<button type="button" onclick="apiPayBooking(${b.id})" class="rounded-md bg-ember px-3.5 py-2 text-sm font-semibold text-white hover:bg-ember-dark">Bayar sekarang</button>
                     <button type="button" onclick="confirmCancelBooking(${b.id}, '${escapeHtml(b.booking_code)}')" class="link-hover text-muted">Batalkan</button>
                     <button type="button" onclick="simulateBookingTimeout(${b.id})" class="link-hover text-muted text-xs ${this.isCustomerFacing() ? 'hidden' : ''}">Simulasi waktu habis</button>`
                  : b.status === 'paid'
                  ? `<span class="text-sm text-muted">Tiket lunas, tidak dapat dibatalkan</span>
                     <button type="button" disabled class="text-sm text-muted/60 cursor-not-allowed">Batalkan</button>`
                  : `<span class="text-sm text-muted">Status akhir: ${b.status.toUpperCase()}</span>`
              }
            </div>
          </div>
        </div>
      `;
    }

    confirmCancelBooking(bookingId, code) {
      openConfirmModal({
        title: 'Batalkan Booking?',
        message: `Yakin ingin membatalkan booking ${code}? Status akan berubah menjadi cancelled dan kuota tiket dikembalikan.`,
        confirmLabel: 'Ya, Batalkan Booking',
        tone: 'danger',
        onConfirm: () => apiCancelBooking(bookingId),
      });
    }

    // LOGIKA DETAIL EVENT & MODAL BOOKING

    openBookingModal(eventId) {
      const ev = getEvent(eventId, false);
      if (!ev) return;

      const activeTickets = this.storage.db.tickets.filter((t) => t.event_id === ev.id && !t.deleted_at);
      const firstAvail = activeTickets.find((t) => getRemaining(t) > 0) || activeTickets[0] || null;

      this.storage.bookingDraft = {
        eventId: ev.id,
        selectedTicketId: firstAvail ? firstAvail.id : null,
        quantity: 1,
        idempotencyKey: generateIdempotencyKey(),
      };

      renderBookingModal();
      const modal = document.getElementById('booking-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    closeBookingModal() {
      const modal = document.getElementById('booking-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    selectBookingTicket(ticketId) {
      this.storage.bookingDraft.selectedTicketId = Number(ticketId);
      const tk = getTicket(ticketId, false);
      if (tk && this.storage.bookingDraft.quantity > getRemaining(tk)) {
        this.storage.bookingDraft.quantity = Math.max(1, getRemaining(tk));
      }
      renderBookingModal();
    }

    adjustBookingQty(delta) {
      const tk = getTicket(this.storage.bookingDraft.selectedTicketId, false);
      if (!tk) return;
      const maxAllowed = Math.min(getRemaining(tk), FOURTIX_CONFIG.maxTicketsPerEvent);
      const next = this.storage.bookingDraft.quantity + delta;
      if (next >= 1 && next <= Math.max(1, maxAllowed)) {
        this.storage.bookingDraft.quantity = next;
        renderBookingModal();
      }
    }

    setBookingIdempotencyKey(val) {
      this.storage.bookingDraft.idempotencyKey = val;
    }

    regenerateIdempotencyKey() {
      this.storage.bookingDraft.idempotencyKey = generateIdempotencyKey();
      renderBookingModal();
    }

    renderBookingModal() {
      const container = document.getElementById('booking-modal-content');
      const ev = getEvent(this.storage.bookingDraft.eventId, false);
      if (!ev) return;

      const venue = getVenue(ev.venue_id, false);
      const organizer = getUser(ev.organizer_id);
      const tickets = this.storage.db.tickets.filter((t) => t.event_id === ev.id && !t.deleted_at);
      const selectedTk = getTicket(this.storage.bookingDraft.selectedTicketId, false);

      const userActiveCount =
        this.storage.currentUser && this.storage.currentUser.role === 'customer'
          ? getUserEventActiveTicketCount(this.storage.currentUser.id, ev.id)
          : 0;
      const remainingLimit = Math.max(0, FOURTIX_CONFIG.maxTicketsPerEvent - userActiveCount);
      const totalPrice = selectedTk ? Number(selectedTk.price) * Number(this.storage.bookingDraft.quantity) : 0;

      container.innerHTML = `
        <div class="relative shrink-0">
          ${renderEventPoster(ev, true)}
          <button type="button" onclick="closeBookingModal()" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 text-ink flex items-center justify-center" aria-label="Tutup">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-5 overflow-y-auto space-y-5 flex-1">
          <div>
            <h2 class="text-xl font-bold text-ink">${escapeHtml(ev.title)}</h2>
            <p class="text-sm text-muted mt-1">${escapeHtml(formatDateIndo(ev.event_date))}</p>
            <p class="text-sm text-muted">${venue ? `${escapeHtml(venue.name)}, ${escapeHtml(venue.city)}` : '-'}</p>
            ${ev.studio ? `<p class="text-sm text-muted">${escapeHtml(ev.studio)}</p>` : ''}
            ${organizer ? `<p class="text-sm text-muted">Oleh ${escapeHtml(organizer.name)}</p>` : ''}
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold text-ink">Pilih ${ev.type === 'cinema' ? 'kursi' : 'kategori tiket'}</h3>
              <span class="text-xs text-muted">Jatah Anda: <span class="tabular">${userActiveCount} / ${FOURTIX_CONFIG.maxTicketsPerEvent}</span></span>
            </div>
            ${
              tickets.length === 0
                ? `<p class="text-sm text-muted">Belum ada tiket aktif untuk event ini.</p>`
                : `<div class="space-y-2">
                    ${tickets
                      .map((tk) => {
                        const rem = getRemaining(tk);
                        const soldOut = rem <= 0;
                        const isSelected = selectedTk && selectedTk.id === tk.id;
                        return `
                          <button
                            type="button"
                            ${soldOut ? 'disabled' : `onclick="selectBookingTicket(${tk.id})"`}
                            class="w-full text-left rounded-md border px-3.5 py-3 text-sm ${
                              soldOut
                                ? 'border-line text-muted cursor-not-allowed'
                                : isSelected
                                ? 'border-ink cursor-pointer'
                                : 'border-line hover:border-muted cursor-pointer'
                            }"
                          >
                            <span class="flex items-center justify-between gap-3">
                              <span class="font-semibold text-ink">${escapeHtml(tk.label)}</span>
                              <span class="tabular font-semibold text-ink">${formatRupiah(tk.price)}</span>
                            </span>
                            <span class="block text-xs text-muted mt-1">Sisa <span class="tabular">${rem}</span> dari ${tk.quota}</span>
                          </button>
                        `;
                      })
                      .join('')}
                  </div>`
            }
          </div>

          ${
            selectedTk && getRemaining(selectedTk) > 0
              ? `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-line pt-5">
                  <div>
                    <label class="block text-sm font-medium text-ink mb-2">Jumlah tiket (maks. ${FOURTIX_CONFIG.maxTicketsPerEvent})</label>
                    <div class="inline-flex items-center rounded-md border border-line">
                      <button type="button" onclick="adjustBookingQty(-1)" class="px-3 py-1.5 text-ink" aria-label="Kurangi">−</button>
                      <span class="tabular px-4 text-sm font-semibold text-ink">${this.storage.bookingDraft.quantity}</span>
                      <button type="button" onclick="adjustBookingQty(1)" class="px-3 py-1.5 text-ink" aria-label="Tambah">+</button>
                    </div>
                    <p class="text-xs text-muted mt-1.5">Sisa jatah di event ini: <span class="tabular">${remainingLimit}</span> tiket.</p>
                  </div>
                  <div class="${this.isCustomerFacing() ? 'hidden' : ''}">
                    <div class="flex items-center justify-between mb-2">
                      <label class="text-sm font-medium text-ink">Idempotency-Key</label>
                      <button type="button" onclick="regenerateIdempotencyKey()" class="link-hover text-xs text-link">Buat ulang</button>
                    </div>
                    <input
                      type="text"
                      value="${escapeHtml(this.storage.bookingDraft.idempotencyKey)}"
                      oninput="setBookingIdempotencyKey(this.value)"
                      class="w-full rounded-md border border-line px-3 py-2 font-mono text-xs text-ink focus:ring-brass"
                    />
                  </div>
                </div>

                <div class="border-t border-line pt-4 text-xs text-muted ${this.isCustomerFacing() ? 'hidden' : ''}">
                  <p class="font-medium text-ink">Uji pencegahan double submit</p>
                  <p class="mt-0.5">Kirim dua permintaan dengan kunci sama untuk melihat 409 Conflict.</p>
                  <button type="button" onclick="handleTestDoubleSubmit()" class="link-hover text-link mt-2 font-medium">Uji sekarang</button>
                </div>
              `
              : ''
          }
        </div>

        <div class="px-5 py-4 border-t border-line bg-wash flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <p class="text-xs text-muted">Total bayar</p>
            <p class="tabular text-lg font-bold text-ink">${formatRupiah(totalPrice)}</p>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <button type="button" onclick="closeBookingModal()" class="link-hover text-muted">Tutup</button>
            <button type="button" onclick="handleConfirmBooking()" ${!selectedTk || getRemaining(selectedTk) <= 0 ? 'disabled' : ''} class="rounded-md bg-ember px-4 py-2 text-sm font-semibold text-white hover:bg-ember-dark disabled:bg-wash disabled:text-muted disabled:cursor-not-allowed">Pesan tiket</button>
          </div>
        </div>
      `;
    }

    async handleConfirmBooking() {
      if (!this.storage.currentUser) {
        closeBookingModal();
        openAuthModal('login');
        showToast({ method: 'POST', endpoint: '/api/bookings', status: 401, message: 'Silakan masuk sebagai customer untuk melanjutkan pemesanan.' });
        return;
      }

      const res = await apiCreateBooking({
        ticketId: this.storage.bookingDraft.selectedTicketId,
        quantity: this.storage.bookingDraft.quantity,
        idempotencyKey: this.storage.bookingDraft.idempotencyKey,
      });

      showToast({ method: 'POST', endpoint: '/api/bookings', status: res.status, message: res.message });

      if (res.ok) {
        closeBookingModal();
        this.storage.customerPage = 'my-bookings';
        render();
      }
    }

    async handleTestDoubleSubmit() {
      if (!this.storage.currentUser) {
        openAuthModal('login');
        return;
      }
      const first = await apiCreateBooking({
        ticketId: this.storage.bookingDraft.selectedTicketId,
        quantity: this.storage.bookingDraft.quantity,
        idempotencyKey: this.storage.bookingDraft.idempotencyKey,
      });
      showToast({ method: 'POST', endpoint: '/api/bookings (Req #1)', status: first.status, message: first.message });

      if (!first.ok) {
        renderBookingModal();
        return;
      }

      const second = await apiCreateBooking({
        ticketId: this.storage.bookingDraft.selectedTicketId,
        quantity: this.storage.bookingDraft.quantity,
        idempotencyKey: this.storage.bookingDraft.idempotencyKey,
      });
      setTimeout(() => {
        showToast({ method: 'POST', endpoint: '/api/bookings (Req #2)', status: second.status, message: second.message });
      }, 350);

      renderBookingModal();
      render();
    }

    // PANEL ADMIN & ORGANIZER

    renderPanelShell() {
      const user = this.storage.currentUser;
      if (!user || !['admin', 'organizer'].includes(user.role)) {
        this.storage.activeShell = 'customer';
        return renderCustomerShell();
      }

      const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'venues', label: 'Venue' },
        { id: 'events', label: 'Event' },
        { id: 'tickets', label: 'Ticket' },
        { id: 'bookings', label: 'Booking' },
      ];

      let bodyHtml = '';
      if (this.storage.panelTab === 'dashboard') bodyHtml = renderPanelDashboard();
      else if (this.storage.panelTab === 'venues') bodyHtml = renderPanelVenues();
      else if (this.storage.panelTab === 'events') bodyHtml = renderPanelEvents();
      else if (this.storage.panelTab === 'tickets') bodyHtml = renderPanelTickets();
      else if (this.storage.panelTab === 'bookings') bodyHtml = renderPanelBookings();

      return `
        <header class="bg-white border-b border-line">
          <div class="max-w-6xl mx-auto px-4 h-16 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-6">
              <button type="button" onclick="setPanelTab('dashboard')" class="flex items-center gap-2 text-lg font-bold text-ink cursor-pointer">
                <img src="assets/fortikmantap2.png" alt="Fourtix" class="h-7 w-auto">
                <span class="text-muted">Panel</span>
              </button>
              <nav class="flex items-center gap-4 text-sm" aria-label="Navigasi panel">
                ${tabs
                  .map(
                    (t) => `<button type="button" onclick="setPanelTab('${t.id}')" class="link-hover pb-1 ${
                      this.storage.panelTab === t.id ? 'font-semibold text-ink border-b-2 border-ember' : 'text-muted'
                    }">${t.label}</button>`
                  )
                  .join('')}
              </nav>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <button type="button" onclick="switchShell('customer')" class="link-hover text-muted">Lihat web customer</button>
              <button type="button" onclick="apiLogout()" class="link-hover text-muted">Keluar</button>
            </div>
          </div>
        </header>

        <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-7">
          ${bodyHtml}
        </main>
      `;
    }

    // --- TAB PANEL 1: DASHBOARD ---

    renderPanelDashboard() {
      const user = this.storage.currentUser;
      const isAdmin = user.role === 'admin';

      const activeVenues = this.storage.db.venues.filter((v) => !v.deleted_at);
      const scopedEvents = this.storage.db.events.filter((e) => !e.deleted_at && (isAdmin || e.organizer_id === user.id));
      const scopedEventIds = scopedEvents.map((e) => e.id);
      const scopedAllEventIds = this.storage.db.events.filter((e) => isAdmin || e.organizer_id === user.id).map((e) => e.id);

      const scopedActiveTickets = this.storage.db.tickets.filter((t) => !t.deleted_at && scopedEventIds.includes(t.event_id));
      const totalSold = scopedActiveTickets.reduce((sum, t) => sum + Number(t.sold), 0);

      const scopedBookings = this.storage.db.bookings.filter((b) => {
        const tk = getTicket(b.ticket_id, true);
        return tk && scopedAllEventIds.includes(tk.event_id);
      });
      const paidRevenue = scopedBookings
        .filter((b) => b.status === 'paid')
        .reduce((sum, b) => sum + Number(b.total_price), 0);

      const lowQuotaTickets = scopedActiveTickets.filter((t) => getRemaining(t) <= 5);
      const recentBookings = scopedBookings.slice(0, 5);

      const stats = [
        { label: 'Venue aktif', value: activeVenues.length, tab: 'venues', link: 'Lihat detail' },
        { label: isAdmin ? 'Event aktif' : 'Event aktif saya', value: scopedEvents.length, tab: 'events', link: 'Lihat detail' },
        { label: 'Tiket terjual', value: totalSold, tab: 'tickets', link: 'Lihat detail' },
        { label: 'Pendapatan lunas', value: formatRupiah(paidRevenue), tab: 'bookings', link: 'Pantau booking' },
      ];

      return `
        <div class="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-ink">Selamat datang, ${escapeHtml(user.name)}</h1>
            <p class="text-sm text-muted mt-1">Anda masuk sebagai ${escapeHtml(user.role)}. Kelola venue, event, tiket, dan booking.</p>
          </div>
          ${isAdmin ? `<button type="button" onclick="runExpireSchedulerJob()" class="text-sm text-link link-hover">Jalankan scheduler expire</button>` : ''}
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          ${stats
            .map(
              (s) => `
              <div class="border border-line rounded-md p-4 bg-paper">
                <p class="text-xs text-muted">${s.label}</p>
                <p class="tabular text-2xl font-bold ${s.tab === 'events' ? 'text-velvet' : s.tab === 'tickets' ? 'text-brass-dark' : 'text-ember'} mt-1">${s.value}</p>
                <button type="button" onclick="setPanelTab('${s.tab}')" class="link-hover text-xs text-link mt-3">${s.link}</button>
              </div>`
            )
            .join('')}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="border border-line rounded-md overflow-hidden">
            <div class="px-4 py-3 border-b border-line flex items-center justify-between">
              <h2 class="text-sm font-semibold text-ink">Tiket kuota menipis</h2>
              <span class="text-xs text-muted">${lowQuotaTickets.length} tiket</span>
            </div>
            <table class="w-full text-left text-sm">
              <thead class="text-xs text-muted border-b border-line">
                <tr><th class="px-4 py-2 font-medium">Event</th><th class="px-4 py-2 font-medium">Label</th><th class="px-4 py-2 text-right font-medium">Sisa</th></tr>
              </thead>
              <tbody class="divide-y divide-line">
                ${
                  lowQuotaTickets.length === 0
                    ? `<tr><td colspan="3" class="px-4 py-6 text-center text-muted">Semua kuota masih aman.</td></tr>`
                    : lowQuotaTickets
                        .map((t) => {
                          const ev = getEvent(t.event_id, true);
                          return `<tr>
                            <td class="px-4 py-2.5 text-ink truncate max-w-[180px]">${ev ? escapeHtml(ev.title) : '-'}</td>
                            <td class="px-4 py-2.5 text-muted">${escapeHtml(t.label)}</td>
                            <td class="tabular px-4 py-2.5 text-right text-ink">${getRemaining(t)} / ${t.quota}</td>
                          </tr>`;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>

          <div class="border border-line rounded-md overflow-hidden">
            <div class="px-4 py-3 border-b border-line flex items-center justify-between">
              <h2 class="text-sm font-semibold text-ink">5 booking terbaru</h2>
              <span class="text-xs text-muted">Hanya baca</span>
            </div>
            <table class="w-full text-left text-sm">
              <thead class="text-xs text-muted border-b border-line">
                <tr><th class="px-4 py-2 font-medium">Kode</th><th class="px-4 py-2 font-medium">Event</th><th class="px-4 py-2 font-medium">Status</th><th class="px-4 py-2 text-right font-medium">Total</th></tr>
              </thead>
              <tbody class="divide-y divide-line">
                ${
                  recentBookings.length === 0
                    ? `<tr><td colspan="4" class="px-4 py-6 text-center text-muted">Belum ada booking.</td></tr>`
                    : recentBookings
                        .map((b) => {
                          const tk = getTicket(b.ticket_id, true);
                          const ev = tk ? getEvent(tk.event_id, true) : null;
                          return `<tr>
                            <td class="px-4 py-2.5 font-mono text-xs text-ink">${escapeHtml(b.booking_code)}</td>
                            <td class="px-4 py-2.5 text-ink truncate max-w-[140px]">${ev ? escapeHtml(ev.title) : '-'}</td>
                            <td class="px-4 py-2.5 text-muted">${b.status}</td>
                            <td class="tabular px-4 py-2.5 text-right font-semibold text-ink">${formatRupiah(b.total_price)}</td>
                          </tr>`;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // --- TAB PANEL 2: MANAJEMEN VENUE ---

    renderPanelVenues() {
      const isAdmin = this.storage.currentUser.role === 'admin';
      const venues = this.storage.db.venues.filter((v) => (isAdmin && this.storage.showTrashedVenues ? true : !v.deleted_at));

      return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 class="text-xl font-extrabold text-ink">Data Venue</h1>
            <p class="text-xs text-muted mt-0.5">
              ${
                isAdmin
                  ? 'Admin dapat membuat, mengubah (PATCH), soft-delete (jika tanpa event aktif), serta memulihkan venue terhapus.'
                  : 'Mode Baca-Saja (Read-Only): Organizer hanya boleh melihat venue aktif untuk keperluan membuat event.'
              }
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            ${
              isAdmin
                ? `<label class="inline-flex items-center gap-2 text-xs font-medium text-ink bg-card border border-line px-3 py-2 rounded-xl cursor-pointer">
                    <input type="checkbox" ${this.storage.showTrashedVenues ? 'checked' : ''} onchange="toggleTrashedVenues(this.checked)" class="rounded text-brass-dark focus:ring-brass" />
                    Tampilkan Venue Terhapus (withTrashed)
                  </label>
                  <button type="button" onclick="openVenueModal()" class="px-4 py-2 rounded-xl bg-ember hover:bg-ember-dark text-white text-xs font-bold shadow-sm transition cursor-pointer">
                    + Tambah Venue
                  </button>`
                : ''
            }
          </div>
        </div>

        <div class="bg-card rounded-2xl border border-line shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-night text-white">
                <tr>
                  <th class="px-4 py-3 font-semibold w-12">ID</th>
                  <th class="px-4 py-3 font-semibold">Nama Venue</th>
                  <th class="px-4 py-3 font-semibold">Alamat</th>
                  <th class="px-4 py-3 font-semibold">Kota</th>
                  <th class="px-4 py-3 font-semibold">Event Aktif</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  ${isAdmin ? `<th class="px-4 py-3 font-semibold text-right">Aksi</th>` : ''}
                </tr>
              </thead>
              <tbody class="divide-y divide-line">
                ${venues
                  .map((v) => {
                    const activeEvCount = this.storage.db.events.filter((e) => e.venue_id === v.id && !e.deleted_at).length;
                    const isDeleted = Boolean(v.deleted_at);
                    return `
                      <tr class="${isDeleted ? 'bg-error-soft/50 text-muted' : 'hover:bg-paper'}">
                        <td class="px-4 py-3 font-mono text-xs">#${v.id}</td>
                        <td class="px-4 py-3 font-bold ${isDeleted ? 'line-through text-muted' : 'text-ink'}">${escapeHtml(v.name)}</td>
                        <td class="px-4 py-3 text-muted">${escapeHtml(v.address)}</td>
                        <td class="px-4 py-3"><span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-paper text-ink">${escapeHtml(v.city)}</span></td>
                        <td class="px-4 py-3 text-xs font-semibold">${activeEvCount} event</td>
                        <td class="px-4 py-3">
                          ${
                            isDeleted
                              ? `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-error-soft text-error">Terhapus</span>`
                              : `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sage-soft text-sage">Aktif</span>`
                          }
                        </td>
                        ${
                          isAdmin
                            ? `<td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                                ${
                                  isDeleted
                                    ? `<button type="button" onclick="apiRestoreVenue(${v.id})" class="px-3 py-1.5 rounded-lg bg-sage hover:bg-sage text-white text-xs font-semibold cursor-pointer">Restore</button>`
                                    : `<button type="button" onclick="openVenueModal(${v.id})" class="px-3 py-1.5 rounded-lg bg-brass hover:bg-brass text-ink text-xs font-semibold cursor-pointer">Edit</button>
                                       <button type="button" onclick="confirmDeleteVenue(${v.id}, '${escapeHtml(v.name)}')" class="px-3 py-1.5 rounded-lg bg-error hover:bg-error text-white text-xs font-semibold cursor-pointer">Hapus</button>`
                                }
                              </td>`
                            : ''
                        }
                      </tr>
                    `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    confirmDeleteVenue(id, name) {
      openConfirmModal({
        title: 'Soft Delete Venue?',
        message: `Yakin ingin melakukan soft delete pada venue "${name}"? Sistem akan menolak jika venue masih memiliki event aktif.`,
        confirmLabel: 'Ya, Soft Delete',
        tone: 'danger',
        onConfirm: () => apiDeleteVenue(id),
      });
    }

    // --- TAB PANEL 3: MANAJEMEN EVENT ---

    renderPanelEvents() {
      const user = this.storage.currentUser;
      const isAdmin = user.role === 'admin';

      const events = this.storage.db.events.filter((ev) => {
        if (!this.storage.showTrashedEvents && ev.deleted_at) return false;
        if (!isAdmin && !this.storage.showOtherOrganizerEvents && ev.organizer_id !== user.id) return false;
        return true;
      });

      return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 class="text-xl font-extrabold text-ink">Data Event</h1>
            <p class="text-xs text-muted mt-0.5">
              ${
                isAdmin
                  ? 'Admin dapat mengelola semua event. Soft delete event ditolak jika masih ada booking pending, dan otomatis men-soft-delete tiket terkait.'
                  : 'Organizer dapat membuat event cinema/concert dan hanya boleh mengubah/menghapus event miliknya sendiri.'
              }
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            ${
              !isAdmin
                ? `<label class="inline-flex items-center gap-2 text-xs font-medium text-ink bg-card border border-line px-3 py-2 rounded-xl cursor-pointer">
                    <input type="checkbox" ${this.storage.showOtherOrganizerEvents ? 'checked' : ''} onchange="toggleOtherOrganizerEvents(this.checked)" class="rounded text-brass-dark" />
                    Tampilkan EO Lain (Uji 403)
                  </label>`
                : ''
            }
            <label class="inline-flex items-center gap-2 text-xs font-medium text-ink bg-card border border-line px-3 py-2 rounded-xl cursor-pointer">
              <input type="checkbox" ${this.storage.showTrashedEvents ? 'checked' : ''} onchange="toggleTrashedEvents(this.checked)" class="rounded text-brass-dark" />
              withTrashed
            </label>
            <button type="button" onclick="openEventModal()" class="px-4 py-2 rounded-xl bg-ember hover:bg-ember-dark text-white text-xs font-bold shadow-sm transition cursor-pointer">
              + Tambah Event
            </button>
          </div>
        </div>

        <div class="bg-card rounded-2xl border border-line shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-night text-white">
                <tr>
                  <th class="px-4 py-3 font-semibold">Event</th>
                  <th class="px-4 py-3 font-semibold">Tipe / Studio</th>
                  <th class="px-4 py-3 font-semibold">Venue</th>
                  <th class="px-4 py-3 font-semibold">Organizer</th>
                  <th class="px-4 py-3 font-semibold">Tanggal</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-line">
                ${
                  events.length === 0
                    ? `<tr><td colspan="7" class="px-4 py-8 text-center text-muted">Belum ada data event.</td></tr>`
                    : events
                        .map((ev) => {
                          const venue = getVenue(ev.venue_id, true);
                          const org = getUser(ev.organizer_id);
                          const isOwner = ev.organizer_id === user.id;
                          const isDeleted = Boolean(ev.deleted_at);
                          return `
                            <tr class="${isDeleted ? 'bg-error-soft/50 text-muted' : 'hover:bg-paper'}">
                              <td class="px-4 py-3 font-bold ${isDeleted ? 'line-through' : 'text-ink'}">${escapeHtml(ev.title)}</td>
                              <td class="px-4 py-3">
                                <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${ev.type === 'cinema' ? 'bg-velvet/10 text-velvet' : 'bg-brass-wash text-brass-dark'}">
                                  ${ReservableEvent.fromRaw(ev).getTypeLabel()}
                                </span>
                                ${ev.studio ? `<div class="text-[11px] text-muted mt-0.5">${escapeHtml(ev.studio)}</div>` : ''}
                              </td>
                              <td class="px-4 py-3 text-xs text-muted">${venue ? `${escapeHtml(venue.name)} (${escapeHtml(venue.city)})` : '-'}</td>
                              <td class="px-4 py-3 text-xs">
                                <span class="font-medium text-ink">${org ? escapeHtml(org.name) : '-'}</span>
                                ${
                                  !isAdmin
                                    ? `<span class="block text-[10px] font-bold ${isOwner ? 'text-sage' : 'text-brass-dark'}">${isOwner ? 'Milik Anda' : 'EO Lain'}</span>`
                                    : ''
                                }
                              </td>
                              <td class="px-4 py-3 text-xs text-muted whitespace-nowrap">${escapeHtml(formatDateIndo(ev.event_date))}</td>
                              <td class="px-4 py-3">
                                ${
                                  isDeleted
                                    ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-error-soft text-error">Terhapus</span>`
                                    : `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sage-soft text-sage">Aktif</span>`
                                }
                              </td>
                              <td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                                ${
                                  isDeleted
                                    ? `<button type="button" onclick="apiRestoreEvent(${ev.id})" class="px-3 py-1.5 rounded-lg bg-sage hover:bg-sage text-white text-xs font-semibold cursor-pointer">Restore</button>`
                                    : `<button type="button" onclick="openEventModal(${ev.id})" class="px-3 py-1.5 rounded-lg bg-brass hover:bg-brass text-ink text-xs font-semibold cursor-pointer">Edit</button>
                                       <button type="button" onclick="confirmDeleteEvent(${ev.id}, '${escapeHtml(ev.title)}')" class="px-3 py-1.5 rounded-lg bg-error hover:bg-error text-white text-xs font-semibold cursor-pointer">Hapus</button>`
                                }
                              </td>
                            </tr>
                          `;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    confirmDeleteEvent(id, title) {
      openConfirmModal({
        title: 'Soft Delete Event?',
        message: `Yakin ingin menghapus event "${title}"? Sistem akan memeriksa apakah masih ada booking pending. Jika aman, event dan seluruh tiket terkait akan di-soft-delete.`,
        confirmLabel: 'Ya, Soft Delete Event',
        tone: 'danger',
        onConfirm: () => apiDeleteEvent(id),
      });
    }

    // --- TAB PANEL 4: MANAJEMEN TIKET ---

    renderPanelTickets() {
      const user = this.storage.currentUser;
      const isAdmin = user.role === 'admin';

      const tickets = this.storage.db.tickets.filter((tk) => {
        if (!this.storage.showTrashedTickets && tk.deleted_at) return false;
        const ev = getEvent(tk.event_id, true);
        if (!isAdmin && !this.storage.showOtherOrganizerTickets && (!ev || ev.organizer_id !== user.id)) return false;
        return true;
      });

      return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 class="text-xl font-extrabold text-ink">Data Ticket</h1>
            <p class="text-xs text-muted mt-0.5">
              Constraint aktif: <code class="bg-line/80 px-1 rounded">quota >= 0</code>, <code class="bg-line/80 px-1 rounded">sold >= 0</code>, <code class="bg-line/80 px-1 rounded">sold <= quota</code>. Update kuota via PATCH menolak nilai di bawah <code class="bg-line/80 px-1 rounded">sold</code>.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            ${
              !isAdmin
                ? `<label class="inline-flex items-center gap-2 text-xs font-medium text-ink bg-card border border-line px-3 py-2 rounded-xl cursor-pointer">
                    <input type="checkbox" ${this.storage.showOtherOrganizerTickets ? 'checked' : ''} onchange="toggleOtherOrganizerTickets(this.checked)" class="rounded text-brass-dark" />
                    Tampilkan EO Lain (Uji 403)
                  </label>`
                : ''
            }
            <label class="inline-flex items-center gap-2 text-xs font-medium text-ink bg-card border border-line px-3 py-2 rounded-xl cursor-pointer">
              <input type="checkbox" ${this.storage.showTrashedTickets ? 'checked' : ''} onchange="toggleTrashedTickets(this.checked)" class="rounded text-brass-dark" />
              withTrashed
            </label>
            <button type="button" onclick="openTicketModal()" class="px-4 py-2 rounded-xl bg-ember hover:bg-ember-dark text-white text-xs font-bold shadow-sm transition cursor-pointer">
              + Tambah Ticket
            </button>
          </div>
        </div>

        <div class="bg-card rounded-2xl border border-line shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-night text-white">
                <tr>
                  <th class="px-4 py-3 font-semibold">Event</th>
                  <th class="px-4 py-3 font-semibold">Label (Kursi/Zona)</th>
                  <th class="px-4 py-3 font-semibold">Harga</th>
                  <th class="px-4 py-3 font-semibold">Quota</th>
                  <th class="px-4 py-3 font-semibold">Sold</th>
                  <th class="px-4 py-3 font-semibold">Remaining</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  <th class="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-line">
                ${
                  tickets.length === 0
                    ? `<tr><td colspan="8" class="px-4 py-8 text-center text-muted">Belum ada data tiket.</td></tr>`
                    : tickets
                        .map((tk) => {
                          const ev = getEvent(tk.event_id, true);
                          const rem = getRemaining(tk);
                          const isDeleted = Boolean(tk.deleted_at);
                          const isOwner = ev && ev.organizer_id === user.id;
                          return `
                            <tr class="${isDeleted ? 'bg-error-soft/50 text-muted' : 'hover:bg-paper'}">
                              <td class="px-4 py-3">
                                <div class="font-semibold text-ink">${ev ? escapeHtml(ev.title) : '-'}</div>
                                ${
                                  !isAdmin
                                    ? `<span class="text-[10px] font-bold ${isOwner ? 'text-sage' : 'text-brass-dark'}">${isOwner ? 'Event Anda' : 'Event EO Lain'}</span>`
                                    : ''
                                }
                              </td>
                              <td class="px-4 py-3 font-bold ${isDeleted ? 'line-through' : 'text-ink'}">${escapeHtml(tk.label)}</td>
                              <td class="px-4 py-3 font-semibold text-ink">${formatRupiah(tk.price)}</td>
                              <td class="px-4 py-3 font-bold">${tk.quota}</td>
                              <td class="px-4 py-3 font-semibold text-brass-dark">${tk.sold}</td>
                              <td class="px-4 py-3">
                                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${rem <= 5 ? 'bg-error-soft text-error' : 'bg-sage-soft text-sage'}">${rem}</span>
                              </td>
                              <td class="px-4 py-3">
                                ${
                                  isDeleted
                                    ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-error-soft text-error">Terhapus</span>`
                                    : `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sage-soft text-sage">Aktif</span>`
                                }
                              </td>
                              <td class="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                                ${
                                  isDeleted
                                    ? `<button type="button" onclick="apiRestoreTicket(${tk.id})" class="px-3 py-1.5 rounded-lg bg-sage hover:bg-sage text-white text-xs font-semibold cursor-pointer">Restore</button>`
                                    : `<button type="button" onclick="openTicketModal(${tk.id})" class="px-3 py-1.5 rounded-lg bg-brass hover:bg-brass text-ink text-xs font-semibold cursor-pointer">Edit</button>
                                       <button type="button" onclick="confirmDeleteTicket(${tk.id}, '${escapeHtml(tk.label)}')" class="px-3 py-1.5 rounded-lg bg-error hover:bg-error text-white text-xs font-semibold cursor-pointer">Hapus</button>`
                                }
                              </td>
                            </tr>
                          `;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    confirmDeleteTicket(id, label) {
      openConfirmModal({
        title: 'Soft Delete Ticket?',
        message: `Yakin ingin men-soft-delete tiket "${label}"? Riwayat booking lama tetap aman dan tampil melalui withTrashed().`,
        confirmLabel: 'Ya, Soft Delete',
        tone: 'danger',
        onConfirm: () => apiDeleteTicket(id),
      });
    }

    // --- TAB PANEL 5: PANTAUAN BOOKING ---

    renderPanelBookings() {
      const user = this.storage.currentUser;
      const isAdmin = user.role === 'admin';
      const scopedAllEventIds = this.storage.db.events.filter((e) => isAdmin || e.organizer_id === user.id).map((e) => e.id);

      const bookings = this.storage.db.bookings.filter((b) => {
        const tk = getTicket(b.ticket_id, true);
        return tk && scopedAllEventIds.includes(tk.event_id);
      });

      return `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h1 class="text-xl font-extrabold text-ink">Pantauan Booking</h1>
            <p class="text-xs text-muted mt-0.5">
              ${
                isAdmin
                  ? 'Admin melihat seluruh transaksi booking. Tampilan baca-saja (Admin & Organizer tidak boleh membayar/membatalkan booking customer).'
                  : 'Organizer hanya melihat transaksi booking dari event miliknya sendiri (termasuk event/tiket terhapus via withTrashed).'
              }
            </p>
          </div>
          ${
            isAdmin
              ? `<button type="button" onclick="runExpireSchedulerJob()" class="px-4 py-2 rounded-xl bg-velvet hover:bg-velvet-deep text-white text-xs font-bold shadow-sm transition cursor-pointer">
                  Jalankan job expire
                </button>`
              : ''
          }
        </div>

        <div class="bg-brass-wash border border-brass/30 text-brass-dark text-xs rounded-xl px-4 py-2.5 mb-4">
          <strong>Kebijakan Akses:</strong> Booking dikelola sepenuhnya oleh <em>customer</em> pemiliknya. Tabel di bawah bersifat <strong>Read-Only</strong> untuk kebutuhan monitoring dan audit.
        </div>

        <div class="bg-card rounded-2xl border border-line shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-night text-white">
                <tr>
                  <th class="px-4 py-3 font-semibold">Kode Booking</th>
                  <th class="px-4 py-3 font-semibold">Customer</th>
                  <th class="px-4 py-3 font-semibold">Event &amp; Tiket</th>
                  <th class="px-4 py-3 font-semibold">Qty</th>
                  <th class="px-4 py-3 font-semibold">Total Harga</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  <th class="px-4 py-3 font-semibold">Batas Bayar / Info</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-line">
                ${
                  bookings.length === 0
                    ? `<tr><td colspan="7" class="px-4 py-8 text-center text-muted">Belum ada booking untuk cakupan Anda.</td></tr>`
                    : bookings
                        .map((b) => {
                          const customer = getUser(b.user_id);
                          const tk = getTicket(b.ticket_id, true);
                          const ev = tk ? getEvent(tk.event_id, true) : null;
                          const isArchived = Boolean((tk && tk.deleted_at) || (ev && ev.deleted_at));
                          return `
                            <tr class="hover:bg-paper">
                              <td class="px-4 py-3 font-mono text-xs font-bold text-ink">${escapeHtml(b.booking_code)}</td>
                              <td class="px-4 py-3">
                                <div class="font-semibold text-ink">${customer ? escapeHtml(customer.name) : '-'}</div>
                                <div class="text-[11px] text-muted">${customer ? escapeHtml(customer.email) : ''}</div>
                              </td>
                              <td class="px-4 py-3">
                                <div class="font-semibold text-ink flex flex-wrap items-center gap-1.5">
                                  <span>${ev ? escapeHtml(ev.title) : '-'}</span>
                                  ${isArchived ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-line text-muted">[Arsip]</span>` : ''}
                                </div>
                                <div class="text-xs text-muted">${tk ? escapeHtml(tk.label) : '-'}</div>
                              </td>
                              <td class="px-4 py-3 font-bold">${b.quantity}</td>
                              <td class="px-4 py-3 font-bold text-loketNavy">${formatRupiah(b.total_price)}</td>
                              <td class="px-4 py-3">${renderStatusPill(b.status)}</td>
                              <td class="px-4 py-3 text-xs text-muted">
                                ${
                                  b.status === 'pending' && b.expires_at
                                    ? `<span class="font-semibold" data-countdown-id="${b.id}" data-expires-at="${escapeHtml(b.expires_at)}">...</span>`
                                    : b.status === 'paid' && b.paid_at
                                    ? `Paid: ${escapeHtml(formatDateIndo(b.paid_at))}`
                                    : b.status === 'cancelled' && b.cancelled_at
                                    ? `Cancelled: ${escapeHtml(formatDateIndo(b.cancelled_at))}`
                                    : '-'
                                }
                              </td>
                            </tr>
                          `;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    renderStatusPill(status) {
      const map = {
        pending: 'bg-brass-wash text-brass-dark',
        paid: 'bg-sage-soft text-sage',
        cancelled: 'bg-line text-ink',
        expired: 'bg-error-soft text-error',
      };
      return `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${map[status] || 'bg-paper text-ink'}">${escapeHtml(status)}</span>`;
    }


    openCrudModal(html) {
      document.getElementById('crud-modal-content').innerHTML = html;
      const m = document.getElementById('crud-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    closeCrudModal() {
      const m = document.getElementById('crud-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    // Form venue

    openVenueModal(id = null) {
      const v = id ? getVenue(id, true) : null;
      const isEdit = Boolean(v);
      openCrudModal(`
        <div class="${isEdit ? 'bg-brass text-ink' : 'bg-ember text-white'} px-6 py-4 flex items-center justify-between">
          <h3 class="font-bold text-base">${isEdit ? `Edit Venue #${v.id} (PATCH)` : 'Tambah Venue Baru (POST)'}</h3>
          <button type="button" onclick="closeCrudModal()" class="opacity-80 hover:opacity-100 cursor-pointer">✕</button>
        </div>
        <form onsubmit="submitVenueForm(event, ${v ? v.id : 'null'})" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-ink mb-1.5">Nama Venue</label>
            <input id="venue-name" type="text" required value="${v ? escapeHtml(v.name) : ''}" placeholder="Contoh: XXI Ayani Mega Mall" class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-ink mb-1.5">Alamat Lengkap</label>
            <input id="venue-address" type="text" required value="${v ? escapeHtml(v.address) : ''}" placeholder="Jl. Ahmad Yani..." class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-ink mb-1.5">Kota</label>
            <input id="venue-city" type="text" required value="${v ? escapeHtml(v.city) : ''}" placeholder="Pontianak" class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="closeCrudModal()" class="px-4 py-2 rounded-xl border border-line text-ink text-xs font-semibold cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-ember hover:bg-ember-dark text-white text-xs font-bold cursor-pointer">Simpan Venue</button>
          </div>
        </form>
      `);
    }

    async submitVenueForm(e, id) {
      e.preventDefault();
      const ok = await apiSaveVenue(id, {
        name: document.getElementById('venue-name').value.trim(),
        address: document.getElementById('venue-address').value.trim(),
        city: document.getElementById('venue-city').value.trim(),
      });
      if (ok) {
        closeCrudModal();
        render();
      }
    }

    // Form event

    openEventModal(id = null) {
      const ev = id ? getEvent(id, true) : null;
      const isEdit = Boolean(ev);
      if (isEdit && !canManageEvent(ev)) {
        showToast({ method: 'PATCH', endpoint: `/api/events/${ev.id}`, status: 403, message: 'EventPolicy: Organizer tidak boleh mengubah event milik organizer lain!' });
        return;
      }

      const activeVenues = this.storage.db.venues.filter((v) => !v.deleted_at);
      const organizers = this.storage.db.users.filter((u) => u.role === 'organizer');
      const isAdmin = this.storage.currentUser.role === 'admin';
      const defaultType = ev ? ev.type : 'cinema';

      openCrudModal(`
        <div class="${isEdit ? 'bg-brass text-ink' : 'bg-ember text-white'} px-6 py-4 flex items-center justify-between">
          <h3 class="font-bold text-base">${isEdit ? `Edit Event #${ev.id} (PATCH)` : 'Tambah Event Baru (POST)'}</h3>
          <button type="button" onclick="closeCrudModal()" class="opacity-80 hover:opacity-100 cursor-pointer">✕</button>
        </div>
        <form onsubmit="submitEventForm(event, ${ev ? ev.id : 'null'})" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-ink mb-1.5">Judul Event</label>
            <input id="ev-title" type="text" required value="${ev ? escapeHtml(ev.title) : ''}" placeholder="Contoh: Coldplay Live atau Avengers IMAX" class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-ink mb-1.5">Venue Aktif</label>
              <select id="ev-venue" required class="w-full rounded-xl border border-line px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-brass">
                ${activeVenues
                  .map((v) => `<option value="${v.id}" ${ev && ev.venue_id === v.id ? 'selected' : ''}>${escapeHtml(v.name)} (${escapeHtml(v.city)})</option>`)
                  .join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-ink mb-1.5">Tipe Event</label>
              <select id="ev-type" onchange="toggleStudioField(this.value)" class="w-full rounded-xl border border-line px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-brass">
                <option value="cinema" ${defaultType === 'cinema' ? 'selected' : ''}>Cinema (Bioskop)</option>
                <option value="concert" ${defaultType === 'concert' ? 'selected' : ''}>Concert (Konser)</option>
              </select>
            </div>
          </div>

          <div id="ev-studio-wrap" class="${defaultType === 'cinema' ? '' : 'hidden'}">
            <label class="block text-xs font-semibold text-ink mb-1.5">Studio (Khusus CinemaShow)</label>
            <input id="ev-studio" type="text" value="${ev && ev.studio ? escapeHtml(ev.studio) : ''}" placeholder="Contoh: Studio 1 IMAX" class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-ink mb-1.5">Tanggal &amp; Jam Event</label>
              <input id="ev-date" type="datetime-local" required value="${ev ? toDatetimeLocalValue(ev.event_date) : toDatetimeLocalValue(offsetDate({ days: 7 }))}" class="w-full rounded-xl border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
            </div>
            ${
              isAdmin && !isEdit
                ? `<div>
                    <label class="block text-xs font-semibold text-ink mb-1.5">Pemilik (Organizer)</label>
                    <select id="ev-organizer" class="w-full rounded-xl border border-line px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-brass">
                      ${organizers.map((o) => `<option value="${o.id}">${escapeHtml(o.name)}</option>`).join('')}
                    </select>
                  </div>`
                : ''
            }
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="closeCrudModal()" class="px-4 py-2 rounded-xl border border-line text-ink text-xs font-semibold cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-ember hover:bg-ember-dark text-white text-xs font-bold cursor-pointer">Simpan Event</button>
          </div>
        </form>
      `);
    }

    toggleStudioField(type) {
      const wrap = document.getElementById('ev-studio-wrap');
      if (!wrap) return;
      if (type === 'cinema') wrap.classList.remove('hidden');
      else wrap.classList.add('hidden');
    }

    async submitEventForm(e, id) {
      e.preventDefault();
      const orgEl = document.getElementById('ev-organizer');
      const ok = await apiSaveEvent(id, {
        title: document.getElementById('ev-title').value,
        venue_id: document.getElementById('ev-venue').value,
        type: document.getElementById('ev-type').value,
        studio: document.getElementById('ev-studio').value,
        event_date: document.getElementById('ev-date').value,
        organizer_id: orgEl ? orgEl.value : this.storage.currentUser.id,
      });
      if (ok) {
        closeCrudModal();
        render();
      }
    }

    // Form tiket

    openTicketModal(id = null) {
      const tk = id ? getTicket(id, true) : null;
      const isEdit = Boolean(tk);
      if (isEdit && !canManageTicket(tk)) {
        showToast({ method: 'PATCH', endpoint: `/api/tickets/${tk.id}`, status: 403, message: 'TicketPolicy: Organizer tidak boleh mengubah tiket milik organizer lain!' });
        return;
      }

      const isAdmin = this.storage.currentUser.role === 'admin';
      const selectableEvents = this.storage.db.events.filter((e) => !e.deleted_at && (isAdmin || e.organizer_id === this.storage.currentUser.id));

      if (!isEdit && selectableEvents.length === 0) {
        showToast({ method: 'POST', endpoint: '/api/tickets', status: 422, message: 'Buat event aktif terlebih dahulu sebelum menambahkan tiket.' });
        return;
      }

      openCrudModal(`
        <div class="${isEdit ? 'bg-brass text-ink' : 'bg-ember text-white'} px-6 py-4 flex items-center justify-between">
          <h3 class="font-bold text-base">${isEdit ? `Edit Ticket #${tk.id} (PATCH)` : 'Tambah Ticket Baru (POST)'}</h3>
          <button type="button" onclick="closeCrudModal()" class="opacity-80 hover:opacity-100 cursor-pointer">✕</button>
        </div>
        <form onsubmit="submitTicketForm(event, ${tk ? tk.id : 'null'})" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-ink mb-1.5">Event</label>
            <select id="tk-event" ${isEdit ? 'disabled' : ''} class="w-full rounded-xl border border-line px-3 py-2.5 text-sm bg-card disabled:bg-paper focus:outline-none focus:ring-2 focus:ring-brass">
              ${selectableEvents
                .map((e) => `<option value="${e.id}" ${tk && tk.event_id === e.id ? 'selected' : ''}>${escapeHtml(e.title)} (${e.type})</option>`)
                .join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-ink mb-1.5">Label Kursi / Zona</label>
            <input id="tk-label" type="text" required value="${tk ? escapeHtml(tk.label) : ''}" placeholder="Contoh: A1 (Bioskop) atau VIP (Konser)" class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-ink mb-1.5">Harga (Rp)</label>
              <input id="tk-price" type="number" min="0" step="1000" required value="${tk ? tk.price : 100000}" class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-ink mb-1.5">Quota ${isEdit ? `(Minimal sold = ${tk.sold})` : ''}</label>
              <input id="tk-quota" type="number" min="0" required value="${tk ? tk.quota : 20}" class="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brass" />
            </div>
          </div>
          ${
            isEdit
              ? `<div class="bg-brass-wash border border-brass/30 text-ink text-[11px] rounded-xl px-3.5 py-2.5">
                  <strong>Uji Constraint:</strong> Saat ini <code>sold = ${tk.sold}</code>. Coba isi quota di bawah ${tk.sold} untuk melihat penolakan <code>422</code> sesuai aturan <code>lockForUpdate()</code>.
                </div>`
              : ''
          }
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="closeCrudModal()" class="px-4 py-2 rounded-xl border border-line text-ink text-xs font-semibold cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-ember hover:bg-ember-dark text-white text-xs font-bold cursor-pointer">Simpan Ticket</button>
          </div>
        </form>
      `);
    }

    async submitTicketForm(e, id) {
      e.preventDefault();
      const ok = await apiSaveTicket(id, {
        event_id: document.getElementById('tk-event').value,
        label: document.getElementById('tk-label').value,
        price: document.getElementById('tk-price').value,
        quota: document.getElementById('tk-quota').value,
      });
      if (ok) {
        closeCrudModal();
        render();
      }
    }

    // HANDLER MODAL AUTENTIKASI

    openAuthModal(tab = 'login') {
      switchAuthTab(tab);
      hideAuthError();
      const m = document.getElementById('auth-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    closeAuthModal() {
      const m = document.getElementById('auth-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    switchAuthTab(tab) {
      const loginForm = document.getElementById('login-form');
      const regForm = document.getElementById('register-form');
      const tabLogin = document.getElementById('auth-tab-login');
      const tabReg = document.getElementById('auth-tab-register');
      hideAuthError();

      if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        tabLogin.className = 'py-3 text-sm font-semibold border-b-2 border-sigudaBlue text-brass-dark bg-card cursor-pointer';
        tabReg.className = 'py-3 text-sm font-semibold border-b-2 border-transparent text-muted hover:text-ink cursor-pointer';
      } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        tabReg.className = 'py-3 text-sm font-semibold border-b-2 border-sigudaBlue text-brass-dark bg-card cursor-pointer';
        tabLogin.className = 'py-3 text-sm font-semibold border-b-2 border-transparent text-muted hover:text-ink cursor-pointer';
      }
    }

    showAuthError(msg) {
      const box = document.getElementById('auth-error-box');
      document.getElementById('auth-error-text').textContent = msg;
      box.classList.remove('hidden');
    }

    hideAuthError() {
      document.getElementById('auth-error-box').classList.add('hidden');
    }

    quickFillLogin(email) {
      const liveAccounts = {
        'nova@test.com': { email: 'test@example.com', password: 'password' },
        'nabila@fourtix.id': { email: 'organizer.a@fourtix.test', password: 'password123' },
        'novi@fourtix.id': { email: 'organizer.b@fourtix.test', password: 'password123' },
        'admin@fourtix.id': { email: 'admin@fourtix.test', password: 'password123' },
      };
      const account = this.storage.mode === 'live' ? liveAccounts[email] : null;
      document.getElementById('login-email').value = account ? account.email : email;
      document.getElementById('login-password').value = account ? account.password : 'password123';
      hideAuthError();
    }

    async handleLoginSubmit(e) {
      e.preventDefault();
      hideAuthError();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const res = await apiLogin(email, password);
      showToast({ method: 'POST', endpoint: '/api/login', status: res.status, message: res.message });

      if (!res.ok) {
        showAuthError(res.message);
        return;
      }

      closeAuthModal();
      this.storage.activeShell = this.storage.currentUser.role === 'customer' ? 'customer' : 'panel';
      this.storage.panelTab = 'dashboard';
      syncRoleSwitcherDropdown();
      render();
    }

    async handleRegisterSubmit(e) {
      e.preventDefault();
      hideAuthError();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-password-confirm').value;

      const res = await apiRegister(name, email, password, confirm);
      showToast({ method: 'POST', endpoint: '/api/register', status: res.status, message: res.message });

      if (!res.ok) {
        showAuthError(res.message);
        return;
      }

      closeAuthModal();
      this.storage.activeShell = 'customer';
      this.storage.customerPage = 'explore';
      syncRoleSwitcherDropdown();
      render();
    }

    // NAVIGASI & FILTER

    switchShell(shell) {
      this.storage.activeShell = shell;
      render();
    }

    navigateCustomer(page) {
      this.storage.activeShell = 'customer';
      this.storage.customerPage = page;
      render();
    }

    setPanelTab(tab) {
      this.storage.activeShell = 'panel';
      this.storage.panelTab = tab;
      render();
    }

    handleSearchInput(val) {
      this.storage.searchQuery = val;
      if (this.storage.customerPage !== 'explore') this.storage.customerPage = 'explore';
      render();
      const input = document.getElementById('customer-search-input');
      if (input) {
        input.focus();
        input.setSelectionRange(val.length, val.length);
      }
    }

    setCategoryFilter(cat) {
      this.storage.categoryFilter = cat;
      render();
    }

    setCityFilter(city) {
      this.storage.cityFilter = city;
      render();
    }

    toggleTrashedVenues(val) {
      this.storage.showTrashedVenues = val;
      render();
    }

    toggleTrashedEvents(val) {
      this.storage.showTrashedEvents = val;
      render();
    }

    toggleTrashedTickets(val) {
      this.storage.showTrashedTickets = val;
      render();
    }

    toggleOtherOrganizerEvents(val) {
      this.storage.showOtherOrganizerEvents = val;
      render();
    }

    toggleOtherOrganizerTickets(val) {
      this.storage.showOtherOrganizerTickets = val;
      render();
    }

    // KONTROL BAR ATAS (RBAC & MODE)

    syncRoleSwitcherDropdown() {
      const sel = document.getElementById('role-switcher');
      if (!this.storage.currentUser) {
        sel.value = 'guest';
        return;
      }
      if (this.storage.currentUser.email === 'admin@fourtix.id') sel.value = 'admin';
      else if (this.storage.currentUser.email === 'nabila@fourtix.id') sel.value = 'organizer_a';
      else if (this.storage.currentUser.email === 'novi@fourtix.id') sel.value = 'organizer_b';
      else sel.value = 'customer';
    }

    setApiMode(mode) {
      this.storage.mode = mode;
      const mockBtn = document.getElementById('mode-mock-btn');
      const liveBtn = document.getElementById('mode-live-btn');

      if (mode === 'mock') {
        mockBtn.className = 'px-2 py-1 text-xs text-link font-semibold underline underline-offset-2';
        liveBtn.className = 'px-2 py-1 text-xs text-muted';
        showToast({ method: 'INFO', endpoint: 'mode/mock', status: 200, message: 'Mode Mock Data aktif. Semua aksi berjalan di memori browser.' });
      } else {
        liveBtn.className = 'px-2 py-1 text-xs text-link font-semibold underline underline-offset-2';
        mockBtn.className = 'px-2 py-1 text-xs text-muted';
        if (!this.storage.token) {
          this.storage.currentUser = null;
          this.storage.activeShell = 'customer';
          render();
        }
        showToast({
          method: 'INFO',
          endpoint: this.storage.apiBaseUrl,
          status: 200,
          message: this.storage.token
            ? `Mode Live API aktif (${this.storage.apiBaseUrl}).`
            : `Mode Live API aktif (${this.storage.apiBaseUrl}). Klik Masuk untuk mendapatkan token Sanctum.`,
        });
      }
      this.syncDevControls();
    }


    // HITUNG MUNDUR BOOKING PENDING

    updateCountdowns() {
      const els = document.querySelectorAll('[data-countdown-id]');
      const now = Date.now();
      els.forEach((el) => {
        const exp = new Date(el.getAttribute('data-expires-at')).getTime();
        const diff = Math.floor((exp - now) / 1000);
        if (diff <= 0) {
          el.textContent = 'Waktu Habis! (Siap Expire / 409)';
          el.className = 'text-xs font-bold mt-1 text-error';
        } else {
          const mins = String(Math.floor(diff / 60)).padStart(2, '0');
          const secs = String(diff % 60).padStart(2, '0');
          el.textContent = `Sisa waktu bayar: ${mins}:${secs}`;
          el.className = 'text-xs font-semibold mt-1 text-brass-dark';
        }
      });
    }


    // FUNGSI RENDER UTAMA

    render() {
      this.syncDevControls();
      const root = document.getElementById('app-root');
      root.innerHTML = this.storage.activeShell === 'panel' ? renderPanelShell() : renderCustomerShell();
      updateCountdowns();
    }
    }

    const storage = new FourtixStorage();
    const gateway = new ApiGateway(storage);
    window.app = new FourtixAppController(storage, gateway);

    const bridge = {
  getVenue: (...args) => gateway.getVenue(...args),
  getEvent: (...args) => gateway.getEvent(...args),
  getTicket: (...args) => gateway.getTicket(...args),
  getUser: (...args) => gateway.getUser(...args),
  getRemaining: (...args) => gateway.getRemaining(...args),
  getUserEventActiveTicketCount: (...args) => gateway.getUserEventActiveTicketCount(...args),
  getLowestTicketPrice: (...args) => gateway.getLowestTicketPrice(...args),
  liveRequest: (...args) => gateway.liveRequest(...args),
  syncFromLiveApi: (...args) => gateway.syncFromLiveApi(...args),
  apiLogin: (...args) => gateway.apiLogin(...args),
  apiRegister: (...args) => gateway.apiRegister(...args),
  apiLogout: (...args) => gateway.apiLogout(...args),
  apiCreateBooking: (...args) => gateway.apiCreateBooking(...args),
  expireBookingRecord: (...args) => gateway.expireBookingRecord(...args),
  apiPayBooking: (...args) => gateway.apiPayBooking(...args),
  apiCancelBooking: (...args) => gateway.apiCancelBooking(...args),
  simulateBookingTimeout: (...args) => gateway.simulateBookingTimeout(...args),
  runExpireSchedulerJob: (...args) => gateway.runExpireSchedulerJob(...args),
  apiSaveVenue: (...args) => gateway.apiSaveVenue(...args),
  apiDeleteVenue: (...args) => gateway.apiDeleteVenue(...args),
  apiRestoreVenue: (...args) => gateway.apiRestoreVenue(...args),
  canManageEvent: (...args) => gateway.canManageEvent(...args),
  apiSaveEvent: (...args) => gateway.apiSaveEvent(...args),
  apiDeleteEvent: (...args) => gateway.apiDeleteEvent(...args),
  apiRestoreEvent: (...args) => gateway.apiRestoreEvent(...args),
  canManageTicket: (...args) => gateway.canManageTicket(...args),
  apiSaveTicket: (...args) => gateway.apiSaveTicket(...args),
  apiDeleteTicket: (...args) => gateway.apiDeleteTicket(...args),
  apiRestoreTicket: (...args) => gateway.apiRestoreTicket(...args),
  showToast: (...args) => window.app.showToast(...args),
  openConfirmModal: (...args) => window.app.openConfirmModal(...args),
  closeConfirmModal: (...args) => window.app.closeConfirmModal(...args),
  renderEventPoster: (...args) => window.app.renderEventPoster(...args),
  renderCustomerShell: (...args) => window.app.renderCustomerShell(...args),
  renderCustomerExplore: (...args) => window.app.renderCustomerExplore(...args),
  renderCustomerBookings: (...args) => window.app.renderCustomerBookings(...args),
  renderCustomerBookingCard: (...args) => window.app.renderCustomerBookingCard(...args),
  confirmCancelBooking: (...args) => window.app.confirmCancelBooking(...args),
  openBookingModal: (...args) => window.app.openBookingModal(...args),
  closeBookingModal: (...args) => window.app.closeBookingModal(...args),
  selectBookingTicket: (...args) => window.app.selectBookingTicket(...args),
  adjustBookingQty: (...args) => window.app.adjustBookingQty(...args),
  setBookingIdempotencyKey: (...args) => window.app.setBookingIdempotencyKey(...args),
  regenerateIdempotencyKey: (...args) => window.app.regenerateIdempotencyKey(...args),
  renderBookingModal: (...args) => window.app.renderBookingModal(...args),
  handleConfirmBooking: (...args) => window.app.handleConfirmBooking(...args),
  handleTestDoubleSubmit: (...args) => window.app.handleTestDoubleSubmit(...args),
  renderPanelShell: (...args) => window.app.renderPanelShell(...args),
  renderPanelDashboard: (...args) => window.app.renderPanelDashboard(...args),
  renderPanelVenues: (...args) => window.app.renderPanelVenues(...args),
  confirmDeleteVenue: (...args) => window.app.confirmDeleteVenue(...args),
  renderPanelEvents: (...args) => window.app.renderPanelEvents(...args),
  confirmDeleteEvent: (...args) => window.app.confirmDeleteEvent(...args),
  renderPanelTickets: (...args) => window.app.renderPanelTickets(...args),
  confirmDeleteTicket: (...args) => window.app.confirmDeleteTicket(...args),
  renderPanelBookings: (...args) => window.app.renderPanelBookings(...args),
  renderStatusPill: (...args) => window.app.renderStatusPill(...args),
  openCrudModal: (...args) => window.app.openCrudModal(...args),
  closeCrudModal: (...args) => window.app.closeCrudModal(...args),
  openVenueModal: (...args) => window.app.openVenueModal(...args),
  submitVenueForm: (...args) => window.app.submitVenueForm(...args),
  openEventModal: (...args) => window.app.openEventModal(...args),
  toggleStudioField: (...args) => window.app.toggleStudioField(...args),
  submitEventForm: (...args) => window.app.submitEventForm(...args),
  openTicketModal: (...args) => window.app.openTicketModal(...args),
  submitTicketForm: (...args) => window.app.submitTicketForm(...args),
  openAuthModal: (...args) => window.app.openAuthModal(...args),
  closeAuthModal: (...args) => window.app.closeAuthModal(...args),
  switchAuthTab: (...args) => window.app.switchAuthTab(...args),
  showAuthError: (...args) => window.app.showAuthError(...args),
  hideAuthError: (...args) => window.app.hideAuthError(...args),
  quickFillLogin: (...args) => window.app.quickFillLogin(...args),
  handleLoginSubmit: (...args) => window.app.handleLoginSubmit(...args),
  handleRegisterSubmit: (...args) => window.app.handleRegisterSubmit(...args),
  switchShell: (...args) => window.app.switchShell(...args),
  navigateCustomer: (...args) => window.app.navigateCustomer(...args),
  setPanelTab: (...args) => window.app.setPanelTab(...args),
  handleSearchInput: (...args) => window.app.handleSearchInput(...args),
  setCategoryFilter: (...args) => window.app.setCategoryFilter(...args),
  setCityFilter: (...args) => window.app.setCityFilter(...args),
  toggleTrashedVenues: (...args) => window.app.toggleTrashedVenues(...args),
  toggleTrashedEvents: (...args) => window.app.toggleTrashedEvents(...args),
  toggleTrashedTickets: (...args) => window.app.toggleTrashedTickets(...args),
  toggleOtherOrganizerEvents: (...args) => window.app.toggleOtherOrganizerEvents(...args),
  toggleOtherOrganizerTickets: (...args) => window.app.toggleOtherOrganizerTickets(...args),
  syncRoleSwitcherDropdown: (...args) => window.app.syncRoleSwitcherDropdown(...args),
  setApiMode: (...args) => window.app.setApiMode(...args),
  toggleDevMode: (...args) => window.app.toggleDevMode(...args),
  updateCountdowns: (...args) => window.app.updateCountdowns(...args),
  render: (...args) => window.app.render(...args),
    };
    Object.assign(window, bridge);

    // Inisialisasi aplikasi
    window.app.wireGlobalControls();
    window.app.syncRoleSwitcherDropdown();
    window.app.render();
    setInterval(() => window.app.updateCountdowns(), 1000);
