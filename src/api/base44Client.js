// Supabase entity shim — same interface as Base44 db.entities.*
import { supabase } from '@/lib/supabase'

const TABLE_MAP = {
  Schedule: 'schedules',
  DiaryEntry: 'diary_entries',
  MonthlyGoal: 'monthly_goals',
  WeeklyGoal: 'weekly_goals',
}

function buildEntity(tableName) {
  return {
    async filter(params = {}, sortField = 'created_at', limit = 50) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      let query = supabase.from(tableName).select('*').eq('user_id', user.id)

      for (const [key, val] of Object.entries(params)) {
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          if (val.$gte !== undefined) query = query.gte(key, val.$gte)
          if (val.$lte !== undefined) query = query.lte(key, val.$lte)
          if (val.$gt !== undefined) query = query.gt(key, val.$gt)
          if (val.$lt !== undefined) query = query.lt(key, val.$lt)
        } else {
          query = query.eq(key, val)
        }
      }

      const col = sortField.startsWith('-') ? sortField.slice(1) : sortField
      query = query.order(col, { ascending: !sortField.startsWith('-') }).limit(limit)

      const { data, error } = await query
      if (error) { console.error(`[${tableName}] filter error:`, error); return [] }
      return data || []
    },

    async get(id) {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single()
      if (error) throw error
      return data
    },

    async create(payload) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase.from(tableName)
        .insert([{ ...payload, user_id: user.id }])
        .select().single()
      if (error) throw error
      return data
    },

    async update(id, payload) {
      const { data, error } = await supabase.from(tableName)
        .update(payload).eq('id', id).select().single()
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id)
      if (error) throw error
      return { id }
    }
  }
}

export const db = {
  auth: {
    async isAuthenticated() {
      const { data: { user } } = await supabase.auth.getUser()
      return !!user
    },
    async me() {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
    async logout() {
      await supabase.auth.signOut()
    }
  },
  entities: Object.fromEntries(
    Object.entries(TABLE_MAP).map(([name, table]) => [name, buildEntity(table)])
  ),
  integrations: {
    Core: { UploadFile: async () => ({ file_url: '' }) }
  }
}

export const base44 = db
export default db
export { supabase }
