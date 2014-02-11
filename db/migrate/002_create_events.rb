class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :host_name
      t.string :host_email
      t.string :title
      t.text :desc
      t.string :location
      t.string :time
    end
  end
end